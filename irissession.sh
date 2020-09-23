#!/bin/bash

iris start $ISC_PACKAGE_INSTANCENAME quietly
 
cat << EOF | iris session $ISC_PACKAGE_INSTANCENAME -U %SYS
do ##class(%SYSTEM.Process).CurrentDirectory("$PWD")
new $namespace
$@
quit 
if '\$Get(sc, 1) do ##class(%SYSTEM.Process).Terminate(, 1)
do ##class(SYS.Container).QuiesceForBundling()
do ##class(Security.Users).UnExpireUserPasswords("*")
halt
EOF

exit=$?

iris stop $ISC_PACKAGE_INSTANCENAME quietly

"$ISC_PACKAGE_INSTALLDIR"/dev/Cloud/ICM/waitISC.sh "$ISC_PACKAGE_INSTANCENAME" 60 "down"

echo "Cleanup IRIS"
rm "$ISC_PACKAGE_INSTALLDIR"/mgr/IRIS.WIJ
rm -f "$ISC_PACKAGE_INSTALLDIR"/mgr/journal/* 
rm -f "$ISC_PACKAGE_INSTALLDIR"/mgr/iristemp/IRIS.DAT

exit $exit