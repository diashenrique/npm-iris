Class diashenrique.npm.util.TimeTracking
{

ClassMethod GetTotalTimeByTask(pTaskId) As %Integer
{
    Set TotalTime = ""

    &SQL(SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as Seconds INTO :TotalTime FROM SQLUser.TimeTracking WHERE TaskId = :pTaskId GROUP BY TaskId)

    Quit ..CalcTimeConsumed(TotalTime)
}

ClassMethod CalcTimeConsumed(pTotalSeconds As %Integer) As %String
{
    Set strTotalTime = "0h 0min"

    If (pTotalSeconds = "") {
        Quit strTotalTime
    }

    Set hour = $Piece((pTotalSeconds / 3600),".")
    Set minute = $Piece((pTotalSeconds / 60 # 60),".")
    ;set second = $Piece((pTotalSeconds # 60),".")
    Set strTotalTime = hour_"h "_minute_"min"

    Quit strTotalTime
}

}
