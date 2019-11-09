Include %occInclude

Class App.Installer
{

Parameter Namespace = "NPM";

XData MyInstall [ XMLNamespace = INSTALLER ]
{
<Manifest>
  <Default Name="NAMESPACE" Value="NPM"/>
  <Default Name="DBNAME" Value="NPM"/>
  <Default Name="APPPATH" Dir="/opt/app/" />
  <Default Name="CSPURL" Dir="/csp/npm" />
  <Default Name="SOURCESPATH" Dir="${APPPATH}src" />
  <Default Name="RESOURCE" Value="%DB_${DBNAME}" /> 

  <Resource Name="%DB_NPM" Description="Resource for NPM application" Permission="RW"/>

  <Namespace Name="${NAMESPACE}" Code="${DBNAME}" Data="${DBNAME}" Create="yes" Ensemble="0">
    <Configuration>
      <Database Name="${DBNAME}" Dir="${MGRDIR}data" Create="yes" Resource="${RESOURCE}" MountAtStartup="true"/>
    </Configuration>
    <CSPApplication Url="${CSPURL}" Directory="${APPPATH}csp/" AuthenticationMethods="64" IsNamespaceDefault="true" Recurse="1" ServeFiles="1"/>
    <LoadPage Dir="${CSPURL}" Flags="ck" IgnoreErrors="1" />
    <Import File="${SOURCESPATH}" Recurse="1"/>
    <LoadPage Dir="/csp/npm" Flags="ck"/>
  </Namespace>
</Manifest>
}

ClassMethod setup(ByRef pVars, pLogLevel As %Integer = 3, pInstaller As %Installer.Installer, pLogger As %Installer.AbstractLogger) As %Status [ CodeMode = objectgenerator, Internal ]
{
  return ##class(%Installer.Manifest).%Generate(%compiledclass, %code, "MyInstall")
}

/// Entry point
ClassMethod custom() As %Status
{
    try {
        write "START CUSTOM INSTALLER",!
        set sc = ..setup(.vars)
        set sc = ..createWebApp()
    } catch (err) {
        set sc = err.AsStatus()
    }
    return sc
}

/// Modify web app REST
ClassMethod createWebApp(appName As %String = "/isproject/rest") As %Status
{
    set:$e(appName)'="/" appName = "/" _ appName
    #dim sc As %Status = $$$OK
    new $namespace
    set $namespace = "%SYS"
    if '##class(Security.Applications).Exists(appName) {
        set props("AutheEnabled") = $$$AutheUnauthenticated
        set props("NameSpace") = ..#Namespace
        set props("IsNameSpaceDefault") = $$$NO
        set props("DispatchClass") = "REST.Dispatch"
        set props("MatchRoles")=":%All"
        set sc = ##class(Security.Applications).Create(appName, .props)
    }
    quit sc
}

}
