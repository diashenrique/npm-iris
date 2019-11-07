Class REST.Dispatch Extends %CSP.REST
{

XData UrlMap [ XMLNamespace = "http://www.intersystems.com/urlmap" ]
{
<Routes>

<Route Url="/" Method="GET" Call="Test" Cors="true"/>

<!-- .User -->
<Route Url="/user" Method="GET" Call="REST.Routes.User:List" Cors="true"/>
<Route Url="/user" Method="POST" Call="REST.Routes.User:NewUser" Cors="true"/>
<Route Url="/user/lookup" Method="GET" Call="REST.Routes.User:Lookup" Cors="true"/>
<Route Url="/user/:id" Method="GET" Call="REST.Routes.User:GetUser" Cors="true"/>
<Route Url="/user/:id" Method="PUT" Call="REST.Routes.User:Update" Cors="true"/>
<Route Url="/user/:id" Method="DELETE" Call="REST.Routes.User:Delete" Cors="true"/>
<!-- ./User -->

<!-- .Team -->
<Route Url="/team" Method="GET" Call="REST.Routes.Team:List" Cors="true"/>
<Route Url="/team" Method="POST" Call="REST.Routes.Team:NewTeam" Cors="true"/>
<Route Url="/team/:id" Method="GET" Call="REST.Routes.Team:GetTeam" Cors="true"/>
<Route Url="/team/:id" Method="PUT" Call="REST.Routes.Team:Update" Cors="true"/>
<Route Url="/team/:id" Method="DELETE" Call="REST.Routes.Team:Delete" Cors="true"/>
<!-- ./Team -->

<!-- .Project -->
<Route Url="/project" Method="GET" Call="REST.Routes.Project:List" Cors="true"/>
<Route Url="/project" Method="POST" Call="REST.Routes.Project:NewProject" Cors="true"/>
<Route Url="/project/lookup" Method="GET" Call="REST.Routes.Project:Lookup" Cors="true"/>
<Route Url="/project/:id" Method="GET" Call="REST.Routes.Project:GetProject" Cors="true"/>
<Route Url="/project/:id" Method="PUT" Call="REST.Routes.Project:Update" Cors="true"/>
<Route Url="/project/:id" Method="DELETE" Call="REST.Routes.Project:Delete" Cors="true"/>
<!-- ./Project -->

<!-- .Calendar -->
<Route Url="/calendar" Method="GET" Call="REST.Routes.Project:List" Cors="true"/>
<Route Url="/calendar" Method="POST" Call="REST.Routes.Project:NewCalendar" Cors="true"/>
<Route Url="/calendar/:id" Method="GET" Call="REST.Routes.Project:GetCalendar" Cors="true"/>
<Route Url="/calendar/:id" Method="PUT" Call="REST.Routes.Project:Update" Cors="true"/>
<Route Url="/calendar/:id" Method="DELETE" Call="REST.Routes.Project:Delete" Cors="true"/>
<!-- ./Calendar -->

<!-- .Scheduler -->
<Route Url="/scheduler" Method="GET" Call="REST.Routes.Scheduler:List" Cors="true"/>
<Route Url="/scheduler" Method="POST" Call="REST.Routes.Scheduler:NewScheduler" Cors="true"/>
<Route Url="/scheduler/:id" Method="GET" Call="REST.Routes.Scheduler:GetScheduler" Cors="true"/>
<Route Url="/scheduler/:id" Method="PUT" Call="REST.Routes.Scheduler:Update" Cors="true"/>
<Route Url="/scheduler/:id" Method="DELETE" Call="REST.Routes.Scheduler:Delete" Cors="true"/>
<!-- ./Scheduler -->

<!-- .Task -->
<Route Url="/task" Method="GET" Call="REST.Routes.Task:TreeList" Cors="true"/>
<Route Url="/task" Method="POST" Call="REST.Routes.Task:NewTask" Cors="true"/>
<Route Url="/task/:id" Method="GET" Call="REST.Routes.Task:GetTask" Cors="true"/>
<Route Url="/task/:id" Method="PUT" Call="REST.Routes.Task:Update" Cors="true"/>
<Route Url="/task/:id" Method="DELETE" Call="REST.Routes.Task:Delete" Cors="true"/>
<!-- ./Task -->

<!-- .Kanban --> 
<Route Url="/kanban" Method="GET" Call="REST.Routes.Kanban:List" Cors="true"/>
<Route Url="/kanban/:id" Method="GET" Call="REST.Routes.Kanban:GetKanban" Cors="true"/>
<Route Url="/kanban/:id" Method="PUT" Call="REST.Routes.Kanban:Update" Cors="true"/>
<!-- ./Kanban -->

<!-- .Gantt --> 
<Route Url="/gantt" Method="GET" Call="REST.Routes.Gantt:List" Cors="true"/>
<Route Url="/gantt" Method="POST" Call="REST.Routes.Gantt:NewTask" Cors="true"/>
<Route Url="/gantt/:id" Method="GET" Call="REST.Routes.Gantt:GetTask" Cors="true"/>
<Route Url="/gantt/:id" Method="PUT" Call="REST.Routes.Gantt:Update" Cors="true"/>
<Route Url="/gantt/:id" Method="DELETE" Call="REST.Routes.Gantt:Delete" Cors="true"/>
<!-- ./Gantt -->
</Routes>
}

ClassMethod Test() As %Status
{
	set %response.ContentType = "application/json"
	set retObj = {}
	set retMessage = "Hello World!"
	set retObj.Message = retMessage
	write retObj.%ToJSON()
	quit $$$OK
}

}
