#!/bin/sh

if [ ! -f "/etc/ssh/ssh_host_rsa_key" ]; then
	ssh-keygen -f /etc/ssh/ssh_host_rsa_key -N '' -t rsa
fi
if [ ! -f "/etc/ssh/ssh_host_dsa_key" ]; then
	ssh-keygen -f /etc/ssh/ssh_host_dsa_key -N '' -t dsa
fi

if [ ! -d "/var/run/sshd" ]; then
	mkdir -p /var/run/sshd
fi

echo 'root:secret'|chpasswd

echo "starting ssshd"
/usr/sbin/sshd -D &

echo "starting dind"
exec /usr/local/bin/dockerd-entrypoint.sh "$@"