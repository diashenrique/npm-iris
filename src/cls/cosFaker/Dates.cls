Class cosFaker.Dates Extends cosFaker.lib.core
{

ClassMethod Forward(pDays As %Integer = 365, pFormat As %Integer = 3)
{
	Quit $ZDateTime(($Horolog + $Random(pDays) +1),pFormat)
}

ClassMethod Backward(pDays As %Integer = 365, pFormat As %Integer = 3)
{
	Quit $ZDateTime((($Horolog - $Random(pDays)) +1),pFormat)
}

ClassMethod BackwardHorolog(pDays As %Integer = 365, pFormat As %Integer = 3)
{
	Quit (($Horolog - $Random(pDays)) +1)
}

ClassMethod ForwardHorolog(pDays As %Integer = 365, pFormat As %Integer = 3)
{
	Quit ($Horolog + $Random(pDays) +1)
}

}
