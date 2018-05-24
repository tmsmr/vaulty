#!/usr/bin/env bash

set -e

TEST_WD=/tmp/vault-test
VAULT_URL=https://releases.hashicorp.com/vault/0.10.1/vault_0.10.1_linux_amd64.zip

TEST_USER=johndoe
TEST_PASS=secret123

# create test dir and change into it
mkdir -p $TEST_WD
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

# set cors policy
./vault write sys/config/cors -<<EOF
{
  "allowed_origins": "*",
  "allowed_headers": "X-Custom-Header"
}
EOF

# create policy for password rw operations
./vault policy write password-store-rw -<<EOF
path "secret/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF

# create policy for password ro operations
./vault policy write password-store-ro -<<EOF
path "secret/*" {
  capabilities = ["read", "list"]
}
EOF

# enable user/pass authentication
./vault auth enable userpass

# create test user with password-store-rw policy
./vault write auth/userpass/users/$TEST_USER \
	password=$TEST_PASS \
	policies=password-store-rw \
	ttl=3600

# create test user with password-store-ro policy
./vault write auth/userpass/users/$TEST_USER-ro \
	password=$TEST_PASS \
	policies=password-store-ro \
	ttl=3600

# insert some data
./vault kv put secret/test-username value=theusername
./vault kv put secret/test-password value=thepassword
./vault kv put secret/customers/github/website value="http://www.github.com"

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
