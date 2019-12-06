var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/rest";

var tasks, idTask, newStatus;

var taskStore = new DevExpress.data.CustomStore({
  key: "ID",
  load: function () {
    return $.getJSON(urlREST + "/task");
  },
  insert: function (values) {
    return $.ajax({
      url: urlREST + "/task",
      method: "POST",
      processData: false,
      contentType: "application/json",
      data: JSON.stringify(values)
    });
  },
  update: function (key, values) {
    return $.ajax({
      url: urlREST + "/task/" + encodeURIComponent(key),
      method: "PUT",
      processData: false,
      contentType: "application/json",
      data: JSON.stringify(values)
    });
  },
  onBeforeSend: function (method, ajaxOptions) {
    ajaxOptions.xhrFields = {
      withCredentials: true
    };
  }
});

$.ajax({
  url: urlREST + "/user",
  method: "GET",
  processData: false,
  contentType: "application/json",
  success: function (e) {
    var users = e.data;
  }
});

var lookupUser = {
  store: new DevExpress.data.CustomStore({
    key: "ID",
    loadMode: "raw",
    load: function () {
      return $.getJSON(urlREST + "/user/lookup");
    }
  }),
  sort: "userName"
};

var lookupProject = {
  store: new DevExpress.data.CustomStore({
    key: "ID",
    loadMode: "raw",
    load: function () {
      return $.getJSON(urlREST + "/project/lookup");
    }
  }),
  sort: "code"
};

$(function () {
  // Popup to create new tasks
  var popup = null;
  var popupOptions = {
    width: 600,
    height: 420,
    contentTemplate: function (e) {
      var formContainer = $("<div id='formPopup'>");
      formContainer
        .dxForm({
          dataSource: taskStore,
          keyExpr: "ID",
          readOnly: false,
          showColonAfterLabel: false,
          labelLocation: "top",
          minColWidth: 300,
          showValidationSummary: true,
          colCount: 2,
          items: [{
              dataField: "Project",
              editorType: "dxSelectBox",
              lookup: {
                dataSource: lookupProject,
                valueExpr: "ID",
                displayExpr: "code"
              }
            },
            {
              dataField: "TaskName"
            },
            {
              dataField: "StartDate",
              dataType: "date",
              editorType: "dxDateBox"
            },
            {
              dataField: "DueDate",
              dataType: "date",
              editorType: "dxDateBox"
            },
            {
              dataField: "Progress",
              editorType: "dxSlider",
              editorOptions: {
                min: 0,
                max: 100,
                value: 0,
                rtlEnabled: false,
                tooltip: {
                  enabled: true,
                  format: function (value) {
                    return value + "%";
                  },
                  showMode: "onHover",
                  position: "bottom"
                }
              }
            },
            {
              dataField: "Priority",
              editorType: "dxSelectBox",
              editorOptions: {
                dataSource: [{
                    id: 1,
                    name: "Normal"
                  },
                  {
                    id: 2,
                    name: "Low"
                  },
                  {
                    id: 3,
                    name: "Medium"
                  },
                  {
                    id: 4,
                    name: "High"
                  }
                ],
                valueExpr: "name",
                displayExpr: "name"
              }
            },
            {
              dataField: "Status",
              editorType: "dxSelectBox",
              editorOptions: {
                dataSource: [{
                    id: 1,
                    name: "Not Started"
                  },
                  {
                    id: 2,
                    name: "In Progress"
                  },
                  {
                    id: 3,
                    name: "Deferred"
                  },
                  {
                    id: 4,
                    name: "Need Assistance"
                  },
                  {
                    id: 5,
                    name: "Completed"
                  }
                ],
                valueExpr: "name",
                displayExpr: "name"
              }
            },
            {
              dataField: "AssignedUser",
              editorType: "dxSelectBox",
              lookup: {
                dataSource: lookupUser,
                valueExpr: "ID",
                displayExpr: "userName"
              }
            },
            {
              itemType: "button",
              colSpan: 2,
              horizontalAlignment: "right",
              buttonOptions: {
                text: "Update Task",
                type: "success",
                onClick: function () {
                  var dataForm = $("#formPopup")
                    .dxForm("instance")
                    .option("formData");

                  $.ajax({
                    url: urlREST + "/kanban",
                    method: "POST",
                    processData: false,
                    contentType: "application/json",
                    data: JSON.stringify(dataForm)
                  }).done(function (msg) {
                    DevExpress.ui.notify("New task save");
                  });

                  $(".popup").remove();
                }
              }
            }
          ]
        })
        .dxForm("instance");
      e.append(formContainer);
    },
    showTitle: true,
    title: "Add New Task",
    visible: false,
    dragEnabled: true,
    closeOnOutsideClick: false
  };

  var showPopup = function (data) {
    console.log(data);
    if (popup) {
      $(".popup").remove();
    }
    var $popupContainer = $("<div />")
      .addClass("popup")
      .appendTo($("#popup"));
    popup = $popupContainer.dxPopup(popupOptions).dxPopup("instance");
    popup.show();
  };

  // Button Add Task
  $("#btnAddTask").dxButton({
    icon: "fas fa-tasks",
    hint: "Add Task",
    onClick: function (e) {
      showPopup();
    }
  });

  // Button Add Task
  $("#btnAddList").dxButton({
    icon: "fas fa-th-list",
    hint: "Add New List",
    onClick: function (e) {
      showPopup();
    }
  });

  // Script to render Kanban cards and lists
  var retTasks = $.getJSON(urlREST + "/kanban")
    .done(function () {
      var tasks = retTasks.responseJSON;
      var statuses = [
        "Not Started",
        "Need Assistance",
        "In Progress",
        "Deferred",
        "Completed"
      ];

      renderKanban($("#kanban"), statuses);

      function renderKanban($container, statuses) {
        statuses.forEach(function (status) {
          renderList($container, status);
        });

        $container.addClass("scrollable-board").dxScrollView({
          direction: "horizontal",
          showScrollbar: "always"
        });
      }

      function renderList($container, status) {
        var $list = $("<div>")
          .addClass("list")
          .appendTo($container);

        renderListTitle($list, status);

        var listTasks = tasks.filter(function (task) {
          return task.Status === status;
        });

        renderCards($list, listTasks);
      }

      function renderListTitle($container, status) {
        $("<div>")
          .addClass("list-title")
          .addClass("dx-theme-text-color")
          .text(status)
          .appendTo($container);
      }

      function renderCards($container, tasks) {
        var $scroll = $("<div>").appendTo($container);
        var $items = $("<div>").appendTo($scroll);

        tasks.forEach(function (task) {
          renderCard($items, task);
        });

        $scroll.addClass("scrollable-list").dxScrollView({
          direction: "vertical",
          showScrollbar: "always"
        });

        $items.addClass("sortable-cards").dxSortable({
          group: "tasksGroup",
          moveItemOnDrop: true,
          onDragEnd: function (info) {
            idTask = info.itemElement[0].id;
            newStatus =
              info.toComponent._$element[0].offsetParent.parentElement
              .parentElement.parentElement.previousElementSibling.outerText;

            $.ajax({
              url: urlREST + "/kanban/" + idTask,
              method: "PUT",
              processData: false,
              contentType: "application/json",
              data: JSON.stringify({
                Status: newStatus
              })
            }).done(function (msg) {
              //alert("Data Saved: " + msg);
            });
          }
        });
      }

      function renderCard($container, task) {
        var $item = $("<div>")
          .attr("id", task.ID)
          .attr("data-toggle", "modal")
          .attr("data-target", "#modalViewTask")
          .addClass("card")
          .addClass("dx-card")
          .addClass("dx-theme-text-color")
          .addClass("dx-theme-background-color")
          .bind({
            click: function () {
              $("#modalViewTaskLabel").text(task.TaskName);
              $("#modalTimeTrackingStatus").text("Time Tracking - " + task.TrackingStatus);
              console.log(task.DueDate);

              var taskDetails = [{
                "ID": task.ID,
                "TaskName": task.TaskName,
                "StartDate": task.StartDate,
                "DueDate": task.DueDate,
                "Progress": task.Progress,
                "Priority": task.Priority,
                "Status": task.Status,
                "AssignedUser": task.AssignedUser,
                "TrackingStatus": task.TrackingStatus
              }];

              console.log(taskDetails[0]);

              var form = $("#form").dxForm({
                dateSerializationFormat: "MM-dd-yyyy",
                formData: taskDetails[0],
                readOnly: false,
                showColonAfterLabel: true,
                labelLocation: "top",
                colCount: 2,
                items: [{
                    dataField: "ID",
                    visible: false
                  },
                  {
                    dataField: "StartDate",
                    editorType: "dxDateBox"
                  },
                  {
                    dataField: "DueDate",
                    editorType: "dxDateBox"
                  },
                  {
                    dataField: "Progress",
                    editorType: "dxSlider",
                    colSpan: 2,
                    editorOptions: {
                      min: 0,
                      max: 100,
                      tooltip: {
                        enabled: true,
                        format: function (value) {
                          return value + "%";
                        },
                        showMode: "onHover"
                      }
                    }
                  },
                  {
                    dataField: "Priority",
                    editorType: "dxSelectBox",
                    editorOptions: {
                      dataSource: [{
                          id: 1,
                          name: "Normal"
                        },
                        {
                          id: 2,
                          name: "Low"
                        },
                        {
                          id: 3,
                          name: "Medium"
                        },
                        {
                          id: 4,
                          name: "High"
                        }
                      ],
                      valueExpr: "name",
                      displayExpr: "name"
                    }
                  },
                  {
                    dataField: "AssignedUser",
                    editorType: "dxSelectBox",
                    editorOptions: {
                      dataSource: lookupUser,
                      displayExpr: "userName",
                      valueExpr: "ID"
                    }
                  },
                  {
                    itemType: "button",
                    colSpan: 2,
                    horizontalAlignment: "right",
                    buttonOptions: {
                      text: "Update Task",
                      type: "default",
                      onClick: function () {
                        var dataForm = $("#form")
                          .dxForm("instance")
                          .option("formData");

                        $.ajax({
                          url: urlREST + "/kanban/" + encodeURIComponent(task.ID),
                          method: "PUT",
                          processData: false,
                          contentType: "application/json",
                          data: JSON.stringify(dataForm)
                        }).done(function (msg) {
                          DevExpress.ui.notify("Task saved", "success");
                        });
                      }
                    }
                  }
                ]
              }).dxForm("instance");

              var btnStart = $("#btn-startTrack").dxButton({
                icon: "fas fa-play-circle",
                hint: "Start Tracking",
                type: "success",
                onClick: function () {
                  $("#btn-stopTrack").dxButton("instance").option("disabled", false);
                  $("#btn-startTrack").dxButton("instance").option("disabled", true);
                  $("#modalTimeTrackingStatus").text("Time Tracking - Running");
                }
              }).dxButton("instance");

              var btnStop = $("#btn-stopTrack").dxButton({
                icon: "fas fa-stop-circle",
                hint: "Stop Tracking",
                type: "danger",
                onClick: function () {
                  $("#btn-stopTrack").dxButton("instance").option("disabled", true);
                  $("#btn-startTrack").dxButton("instance").option("disabled", false);
                  $("#modalTimeTrackingStatus").text("Time Tracking - Stopped");
                }
              }).dxButton("instance");

              if (task.TrackingStatus == "Stopped") {
                btnStop.option("disabled", true);
              } else {
                btnStart.option("disabled", true);
              }

              $("#logHours").dxNumberBox({
                placeholder: "Hours...",
                showSpinButtons: true,
                showClearButton: true,
                value: "",
                min: 0,
                maxLength: 10,
                width: 120
              });


              $("#updateHours").dxButton({
                icon: "fas fa-stopwatch",
                text: "Log work",
                hint: "Log work against this issue",
                type: "default",
                onClick: function () {
                  DevExpress.ui.notify("The stop button was clicked");
                }
              });

            }
          })
          .appendTo($container);

        var user = users.filter(function (user) {
          return user.ID === task.AssignedUser;
        })[0];

        $("<div>")
          .addClass("card-priority")
          .addClass(task.Priority)
          .appendTo($item);
        $("<div>")
          .addClass("card-subject")
          .text(task.TaskName)
          .appendTo($item);
        $("<div>")
          .addClass("card-assignee")
          .html("<i class='far fa-clock'></i> " + task.DueDate)
          .appendTo($item);
        $("<div>")
          .addClass("card-assignee")
          .text(user.UserName)
          .appendTo($item);
      }
    })
    .fail(function () {
      console.log("error");
    });
});

var selectBoxStatus = [{
    id: 1,
    name: "Not Started"
  },
  {
    id: 2,
    name: "In Progress"
  },
  {
    id: 3,
    name: "Deferred"
  },
  {
    id: 4,
    name: "Need Assistance"
  },
  {
    id: 5,
    name: "Completed"
  }
];

var users = [{
    ID: "4",
    UserName: "diashenrique",
    Name: "Henrique Dias",
    email: "henrique@gmail.com",
    DateOfBirth: "02/10/1984",
    JobTitle: "CTO",
    Company: "Nishimura CO",
    ProfileHeading: "Craaazy",
    PhotoProfile: "B5924",
    Active: 1,
    Password: "I6226"
  },
  {
    ID: "7",
    UserName: "ninaroberson",
    Name: "Darren Barker",
    email: "jorgetrevino@yahoo.com",
    DateOfBirth: "10/19/2019",
    JobTitle: "Analyst Dynamic",
    Company: "Utilities",
    ProfileHeading: "Fast learner",
    PhotoProfile: "F8728",
    Active: 0,
    Password: "N6600"
  },
  {
    ID: "9",
    UserName: "ruben_perry",
    Name: "Benjamin Gibbs",
    email: "jimmiemoran83@gmail.com",
    DateOfBirth: "12/29/2018",
    JobTitle: "Director  Legal Internal",
    Company: "Cosmetics",
    ProfileHeading: "Leadership",
    PhotoProfile: "G3775",
    Active: 1,
    Password: "Y770"
  },
  {
    ID: "10",
    UserName: "donbarber",
    Name: "Claudia Spencer Ballard",
    email: "marlene_george21@yahoo.com",
    DateOfBirth: "10/31/2018",
    JobTitle: "Executive  Banking Lead",
    Company: "Alternative Dispute Resolution",
    ProfileHeading: "Teamwork",
    PhotoProfile: "V491",
    Active: 1,
    Password: "E7051"
  },
  {
    ID: "11",
    UserName: "lawrence53",
    Name: "Ivan Hodge",
    email: "tracy.wiley39@yahoo.com",
    DateOfBirth: "06/11/2019",
    JobTitle: "Developer  Retail",
    Company: "Farming",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "Z6670",
    Active: 0,
    Password: "N6971"
  },
  {
    ID: "12",
    UserName: "timsilva67",
    Name: "Nicholas Lambert",
    email: "nataliedean@gmail.com",
    DateOfBirth: "10/27/2018",
    JobTitle: "Planner  Farming",
    Company: "Restaurants",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "M9752",
    Active: 1,
    Password: "T8208"
  },
  {
    ID: "13",
    UserName: "russell.reed",
    Name: "Hilda Nguyen",
    email: "connie_sutton92@hotmail.com",
    DateOfBirth: "12/24/2018",
    JobTitle: "Supervisor  Education",
    Company: " Travel & Tourism",
    ProfileHeading: "Fast learner",
    PhotoProfile: "Q5997",
    Active: 0,
    Password: "Y4561"
  },
  {
    ID: "14",
    UserName: "katherineclark43",
    Name: "Daisy Cameron Saunders Lang",
    email: "rebecca.greene@yahoo.com",
    DateOfBirth: "12/26/2018",
    JobTitle: "Assistant  Marketing Corporate",
    Company: "Health",
    ProfileHeading: "Fast learner",
    PhotoProfile: "C8338",
    Active: 0,
    Password: "U3860"
  },
  {
    ID: "15",
    UserName: "megan.owen34",
    Name: "Penny Buchanan Montoya Hartman",
    email: "kim.davis34@gmail.com",
    DateOfBirth: "01/29/2019",
    JobTitle: "Facilitator  Real-Estate",
    Company: "Security and Investigations",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "X8101",
    Active: 1,
    Password: "T8232"
  },
  {
    ID: "16",
    UserName: "derek_saunders",
    Name: "Victoria Young",
    email: "kathryn_hale38@hotmail.com",
    DateOfBirth: "02/10/2019",
    JobTitle: "Executive Direct",
    Company: "Entertainment",
    ProfileHeading: "Self-motivated",
    PhotoProfile: "V6067",
    Active: 0,
    Password: "C5218"
  },
  {
    ID: "17",
    UserName: "carla_parrish66",
    Name: "Maria Goodwin Fowler",
    email: "danielfletcher@yahoo.com",
    DateOfBirth: "03/23/2019",
    JobTitle: "Producer  Marketing Dynamic",
    Company: "Judiciary",
    ProfileHeading: "Work under pressure",
    PhotoProfile: "H6302",
    Active: 0,
    Password: "R2127"
  },
  {
    ID: "18",
    UserName: "ross54",
    Name: "Hector Newman",
    email: "marjorie_patel@gmail.com",
    DateOfBirth: "06/10/2019",
    JobTitle: "Engineer  Sales",
    Company: "Medical Devices",
    ProfileHeading: "Technical savvy",
    PhotoProfile: "W6274",
    Active: 0,
    Password: "J5791"
  },
  {
    ID: "19",
    UserName: "waynewilliams27",
    Name: "Holly Shelton Reynolds Fields",
    email: "jason35@yahoo.com",
    DateOfBirth: "03/26/2019",
    JobTitle: "Facilitator  Technology Legacy",
    Company: "Sports",
    ProfileHeading: "Networking skills",
    PhotoProfile: "R6818",
    Active: 0,
    Password: "B9174"
  },
  {
    ID: "25",
    UserName: "danieljun",
    Name: "Daniel Jun Nakata Goncalves Dias",
    email: "daniel.nakata.dias@gmail.com",
    DateOfBirth: "06/23/2012",
    JobTitle: "Tech Genius",
    Company: "Nishimura Co",
    ProfileHeading: "",
    PhotoProfile: "",
    Active: 1,
    Password: ""
  }
];