ARG IMAGE=store/intersystems/iris-community:2019.4.0.379.0
FROM $IMAGE

WORKDIR /opt/app

COPY ./csp/resources ./Csp/resources
COPY ./csp/*.csp ./Csp/
COPY ./Installer.cls ./
COPY ./src/cls ./src/

RUN iris start $ISC_PACKAGE_INSTANCENAME quietly EmergencyId=sys,sys && \
    /bin/echo -e "sys\nsys\n" \
    " Do ##class(Security.Users).UnExpireUserPasswords(\"*\")\n" \
    " Do ##class(Security.Users).AddRoles(\"admin\", \"%ALL\")\n" \
    " Do ##class(Security.System).Get(,.p)\n" \
    " Set p(\"AutheEnabled\")=\$zb(p(\"AutheEnabled\"),16,7)\n" \
    " Do ##class(Security.System).Modify(,.p)\n" \
    " Do \$system.OBJ.Load(\"/opt/app/Installer.cls\",\"ck\")\n" \
    " Set sc = ##class(App.Installer).setup(, 3)\n" \
    " If 'sc do \$zu(4, \$JOB, 1)\n" \
    " halt" \
    | iris session $ISC_PACKAGE_INSTANCENAME && \
    /bin/echo -e "sys\nsys\n" \
    | iris stop $ISC_PACKAGE_INSTANCENAME quietly

CMD [ "-l", "/usr/irissys/mgr/messages.log" ]