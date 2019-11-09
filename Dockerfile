ARG IMAGE=store/intersystems/iris-community:2019.4.0.379.0
FROM $IMAGE

#WORKDIR /opt/app

COPY ./csp /opt/app/csp
COPY ./Installer.cls  /opt/app
COPY ./src  /opt/app/src
COPY ./gbl  /opt/gbl

# Used by runinstaller.sh to load the installer manifest class and run it
ENV IRIS_USERNAME="SuperUser" 

# Used by runinstaller.sh and to set instance's default password (this is just a demo!)
ENV IRIS_PASSWORD="sys"

RUN iris start $ISC_PACKAGE_INSTANCENAME quietly && \
    #/bin/echo -e "$IRIS_USERNAME\n$IRIS_PASSWORD\n" \
    /bin/echo -e "\n" \
    " zn \"%SYS\"\n" \
    " Do ##class(Security.Users).UnExpireUserPasswords(\"*\")\n" \
    " Do ##class(Security.Users).AddRoles(\"admin\", \"%ALL\")\n" \
    " Do ##class(Security.System).Get(,.p)\n" \
    " Set p(\"AutheEnabled\")=\$zb(p(\"AutheEnabled\"),16,7)\n" \
    " Do ##class(Security.System).Modify(,.p)\n" \
    " Do \$system.OBJ.Load(\"/opt/app/Installer.cls\",\"ck\")\n" \
    " Set sc = ##class(App.Installer).custom()\n" \
    " If '$get(sc) do \$zu(4, \$JOB, 1)\n" \
    " halt" \
    | iris session $ISC_PACKAGE_INSTANCENAME && \
    /bin/echo -e "\n" \
    #/bin/echo -e "$IRIS_USERNAME\n$IRIS_PASSWORD\n" \
    | iris stop $ISC_PACKAGE_INSTANCENAME quietly

CMD [ "-l", "/usr/irissys/mgr/messages.log" ]