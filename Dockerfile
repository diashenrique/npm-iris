ARG IMAGE=store/intersystems/iris-community:2020.1.0.199.0
ARG IMAGE=intersystemsdc/iris-community:2020.1.0.209.0-zpm
ARG IMAGE=intersystemsdc/iris-community:2020.2.0.196.0-zpm
ARG IMAGE=intersystemsdc/iris-community:2020.3.0.200.0-zpm
FROM $IMAGE

USER root

WORKDIR /opt/irisapp

RUN chown ${ISC_PACKAGE_MGRUSER}:${ISC_PACKAGE_IRISGROUP} .

COPY irissession.sh /

USER ${ISC_PACKAGE_MGRUSER}

COPY Installer.cls .

COPY src src

SHELL ["/irissession.sh"]

RUN \
    do $SYSTEM.OBJ.Load("Installer.cls", "ck") \
    set sc = ##class(App.Installer).setup() 

SHELL ["/bin/sh", "-c"]