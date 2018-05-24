#!/usr/bin/env bash

set -e

TEST_WD=/tmp/vault-test
VAULT_URL=https://releases.hashicorp.com/vault/0.10.1/vault_0.10.1_linux_amd64.zip

TEST_USER=johndoe
TEST_PASS=secret123

# create test dir and change into it
mkdir -p $TEST_WD
cp setup-ldap-auth.sh $TEST_WD/ || true
cd $TEST_WD

# save credentials to env file
echo "export TEST_USER=$TEST_USER" > vault.env
echo "export TEST_PASS=$TEST_PASS" >> vault.env

# download vault binary if not present
if [ ! -f ${TEST_WD}/vault ]; then
    wget -O vault.zip $VAULT_URL
    unzip vault.zip
fi

# kill vault from previous tests
killall vault &> /dev/null || true

# start vault, redirect logs, send to background
./vault server -dev &> vault.log &

# wait a bit
sleep 5

# extract root token from log output
ROOT_TOKEN=`grep "Root Token:" vault.log | cut -d " " -f 3`

# extract VAULT_ADDR
export VAULT_ADDR=`grep "export VAULT_ADDR=" vault.log | cut -d "'" -f 2`

# save $VAULT_ADDR to env file
echo "export VAULT_ADDR=$VAULT_ADDR" >> vault.env

# login
./vault login token=$ROOT_TOKEN

# create a kv engine for vaulty
./vault secrets enable -version=2 -path=vaulty kv

# set cors policy
./vault write sys/config/cors -<<EOF
{
  "allowed_origins": "*",
  "allowed_headers": "X-Custom-Header"
}
EOF

# create policy for password rw operations
./vault policy write vaulty-rw -<<EOF
path "vaulty/metadata/*" {
  capabilities = ["delete", "list"]
}
path "vaulty/data/*" {
  capabilities = ["create", "read", "update"]
}
EOF

# create policy for password ro operations
./vault policy write vaulty-ro -<<EOF
path "vaulty/metadata/*" {
  capabilities = ["list"]
}
path "vaulty/data/*" {
  capabilities = ["read"]
}
EOF

# create policy for password ro operations (without access on customers subfolder)
./vault policy write vaulty-no-customers -<<EOF
path "vaulty/metadata/*" {
  capabilities = ["list"]
}
path "vaulty/data/*" {
  capabilities = ["read"]
}
path "vaulty/data/customers/" {
  capabilities = ["deny"]
}
path "vaulty/metadata/customers/" {
  capabilities = ["deny"]
}
path "vaulty/metadata/customers/*" {
  capabilities = ["deny"]
}
path "vaulty/data/customers/*" {
  capabilities = ["deny"]
}
EOF

# enable user/pass authentication
./vault auth enable userpass

# create test user with vaulty-rw policy
./vault write auth/userpass/users/$TEST_USER \
	password=$TEST_PASS \
	policies=vaulty-rw \
	ttl=3600

# create test user with vaulty-ro policy
./vault write auth/userpass/users/$TEST_USER-ro \
	password=$TEST_PASS \
	policies=vaulty-ro \
	ttl=3600

# create test user with vaulty-no-customers policy
./vault write auth/userpass/users/$TEST_USER-no-customers \
	password=$TEST_PASS \
	policies=vaulty-no-customers \
	ttl=3600

# setup ldap auth via script (if available)
source ./setup-ldap-auth.sh || true

# insert some data
./vault kv put vaulty/test-username value=theusername
./vault kv put vaulty/test-password value=thepassword
./vault kv put vaulty/customers/github/website value="http://www.github.com"

GR='\033[0;32m'
NC='\033[0m'

printf "$GR"
echo "use this test vault:"
echo "cd $TEST_WD && source vault.env"
echo "./vault login -method=userpass username=$TEST_USER password=$TEST_PASS"
echo "./vault status"
printf "$NC"

# show vault logs and wait
tail -f vault.log
