Include %occInclude

Class App.Installer
{

XData MyInstall [ XMLNamespace = INSTALLER ]
{
<Manifest>
  <Default Name="NAMESPACE" Value="NPM"/>
  <Default Name="DBNAME" Value="NPM"/>
  <Default Name="APPPATH" Dir="/opt/irisapp/" />
  <Default Name="CSPURL" Dir="/csp/npm" />
  <Default Name="RESTPATH" Dir="/npm/rest" />
  <Default Name="SOURCESPATH" Dir="${APPPATH}src" />
  <Default Name="RESOURCE" Value="%DB_${DBNAME}" /> 

  <Resource Name="%DB_NPM" Description="Resource for NPM application" Permission="RW"/>

  <Namespace Name="${NAMESPACE}" Code="${DBNAME}" Data="${DBNAME}" Create="yes" Ensemble="0">
    <Configuration>
      <Database Name="${DBNAME}" Dir="${MGRDIR}data" Create="yes" Resource="${RESOURCE}" MountAtStartup="true"/>
    </Configuration>
    <CSPApplication Url="${CSPURL}" Directory="${APPPATH}csp/" AuthenticationMethods="64" IsNamespaceDefault="true" Recurse="1" ServeFiles="1"/>
    <Import File="${SOURCESPATH}/cls" Recurse="1"/>
  </Namespace>

  <Invoke Class="App.Installer" Method="createRESTApp">
    <Arg Value="${RESTPATH}"/>
    <Arg Value="${NAMESPACE}"/>
  </Invoke>

  <Invoke Class="App.Installer" Method="CompileCSP">
    <Arg Value="${CSPURL}"/>
    <Arg Value="${NAMESPACE}"/>
  </Invoke>

</Manifest>
}

ClassMethod setup(ByRef pVars, pLogLevel As %Integer = 3, pInstaller As %Installer.Installer, pLogger As %Installer.AbstractLogger) As %Status [ CodeMode = objectgenerator, Internal ]
{
  Quit ##class(%Installer.Manifest).%Generate(%compiledclass, %code, "MyInstall")
}

/// Modify web app REST
ClassMethod createRESTApp(appName As %String, pNamespace As %String) As %Status
{
  #dim sc As %Status = $$$OK

  New $Namespace
  Set $Namespace = "%SYS"

  If '##class(Security.Applications).Exists(appName) {
    Set props("AutheEnabled") = $$$AutheUnauthenticated
    Set props("NameSpace") = pNamespace
    Set props("IsNameSpaceDefault") = $$$NO
    Set props("DispatchClass") = "diashenrique.npm.REST.Dispatch"
    Set props("MatchRoles")=":%All"
    Set sc = ##class(Security.Applications).Create(appName, .props)
  }
  Quit sc
}

ClassMethod CompileCSP(pApp As %String, pNamespace As %String) As %Status
{
  New $Namespace
  Set $Namespace = pNamespace

  Set list(pApp_"/*.csp") = "" 
  Do $System.OBJ.CompileList(.list,"ck")

  Quit $$$OK
}

}
