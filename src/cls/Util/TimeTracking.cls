Class Util.TimeTracking
{

ClassMethod GetTotalTimeByTask(pTaskId) As %Integer
{
    set TotalTime = ""

    &SQL(SELECT SUM({fn TIMESTAMPDIFF(SQL_TSI_SECOND, StartTracking, EndTracking)}) as Seconds INTO :TotalTime FROM SQLUser.TimeTracking WHERE TaskId = :pTaskId GROUP BY TaskId)

    quit TotalTime
}

ClassMethod CalcTimeConsumed(pTotalSeconds As %Integer) As %String
{
    set strTotalTime = ""

    if (pTotalSeconds = "") {
        quit strTotalTime
    }

    set hour = $piece((pTotalSeconds / 3600),".")
    set minute = $piece((pTotalSeconds / 60 # 60),".")
    ;set second = $piece((pTotalSeconds # 60),".")
    set strTotalTime = hour_"h "_minute_"min"

    quit strTotalTime
}

}
