#!/bin/sh

#SSHD
# prepare keys
if [ ! -f "/etc/ssh/ssh_host_rsa_key" ]; then
	# generate fresh rsa key
	ssh-keygen -f /etc/ssh/ssh_host_rsa_key -N '' -t rsa
fi
if [ ! -f "/etc/ssh/ssh_host_dsa_key" ]; then
	# generate fresh dsa key
	ssh-keygen -f /etc/ssh/ssh_host_dsa_key -N '' -t dsa
fi
#prepare run dir
if [ ! -d "/var/run/sshd" ]; then
	mkdir -p /var/run/sshd
fi

# unlock root user for ssh user
passwd -u root

# start sshd
echo "starting ssshd"
/usr/sbin/sshd -D &

# reread all config
source /etc/profile

if [ ! -d "/root/.ssh" ]; then
	mkdir -p /root/.ssh
fi

# deploy authorized_keys
cp /id_rsa.pub /root/.ssh/authorized_keys

echo "starting dind"
exec /usr/local/bin/dockerd-entrypoint.sh "$@"