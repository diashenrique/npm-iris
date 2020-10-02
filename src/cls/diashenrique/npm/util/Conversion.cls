Class diashenrique.npm.util.Conversion
{

/// do ##class(diashenrique.npm.util.Conversion).DateTimeToISO8601("2020-09-26 00:00:00")
ClassMethod DateTimeToISO8601(pDateTime As %DateTime) As %String
{
    Quit:(pDateTime="") ""

    Set ret = $Case(pDateTime,"":"",:$Replace(pDateTime," ","T")_"Z")

    Quit ret
}

}
