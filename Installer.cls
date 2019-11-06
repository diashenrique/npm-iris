Include %occInclude

Class App.Installer
{

XData MyInstall [ XMLNamespace = INSTALLER ]
{
<Manifest>
  <Default Name="NAMESPACE" Value="NPM"/>
  <Default Name="DBNAME" Value="NPM"/>
  <Default Name="APPPATH" Dir="/opt/app/" />
  <Default Name="SOURCESPATH" Dir="${APPPATH}src" />
  <Default Name="RESOURCE" Value="%DB_${DBNAME}" /> 

  <Namespace Name="${NAMESPACE}" Code="${DBNAME}" Data="${DBNAME}" Create="yes" Ensemble="0">
    <Configuration>
      <Database Name="${DBNAME}" Dir="${APPPATH}${DBNAME}" Create="yes" Resource="${RESOURCE}"/>
    </Configuration>

    <CSPApplication Url="/csp/npm" Directory="${APPPATH}csp/" AuthenticationMethods="64" IsNamespaceDefault="true" Recurse="1" />

    <Import File="${SOURCESPATH}" Recurse="1"/>

    <LoadPage Dir="/csp/npm" Flags="ck"/>
  </Namespace>
</Manifest>
}

ClassMethod setup(ByRef pVars, pLogLevel As %Integer = 3, pInstaller As %Installer.Installer, pLogger As %Installer.AbstractLogger) As %Status [ CodeMode = objectgenerator, Internal ]
{
  Quit ##class(%Installer.Manifest).%Generate(%compiledclass, %code, "MyInstall")
}

}
