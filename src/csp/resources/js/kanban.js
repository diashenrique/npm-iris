var urlOrigin = window.location.origin;
var urlREST = urlOrigin + "/npm/api";

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



$(function () {

  function addTask() {
    $("#divAddTask").dxPopup({
      visible: true,
      showTitle: true,
      title: 'Add New Task',
      width: 500,
      height: 420,
      position: {
        my: 'center',
        at: 'center',
        of: window
      },
      dragEnabled: true,
      closeOnOutsideClick: false,
      contentTemplate: function (e) {
        var formContainer = $("<div id='formPopup'>");
        formContainer.dxForm({
          readOnly: false,
          showColonAfterLabel: false,
          labelLocation: "top",
          minColWidth: 300,
          showValidationSummary: true,
          colCount: 2,
          items: [{
              dataField: "ProjectId",
              editorType: "dxSelectBox",
              editorOptions: {
                dataSource: {
                  store: new DevExpress.data.CustomStore({
                    key: "ID",
                    loadMode: "raw",
                    load: function () {
                      return sendRequest(urlREST + "/project/lookup");
                    }
                  })
                },
                valueExpr: "ID",
                displayExpr: "code"
              },
              validationRules: [{
                type: "required"
              }]
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
                    name: "Backlog"
                  },
                  {
                    id: 2,
                    name: "To-Do"
                  },
                  {
                    id: 3,
                    name: "In-Progress"
                  },
                  {
                    id: 4,
                    name: "Done"
                  },
                  {
                    id: 5,
                    name: "Accepted"
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
                dataSource: {
                  store: new DevExpress.data.CustomStore({
                    key: "ID",
                    loadMode: "raw",
                    load: function () {
                      return sendRequest(urlREST + "/user/lookup");
                    }
                  })
                },
                valueExpr: "ID",
                displayExpr: "userName"
              },
              validationRules: [{
                type: "required"
              }]
            },
            {
              itemType: "button",
              colSpan: 2,
              horizontalAlignment: "right",
              buttonOptions: {
                text: "Add Task",
                type: "success",
                onClick: function () {
                  if (!$("#formPopup").dxForm("instance").validate().isValid) {
                    DevExpress.ui.notify("Há campos obrigatórios não preenchidos!", "warning", 4000);
                  } else {
                    var dataForm = $("#formPopup")
                      .dxForm("instance")
                      .option("formData");

                    console.log(dataForm);

                    $.ajax({
                      url: urlREST + "/kanban",
                      method: "POST",
                      processData: false,
                      contentType: "application/json",
                      data: JSON.stringify(dataForm)
                    }).done(function (msg) {
                      DevExpress.ui.notify("New task saved");
                    });

                    $(".popup").remove();

                    location.reload();
                  }

                }
              }
            }
          ]
        }).dxForm("instance");
        e.append(formContainer);
      }
    });
  }

  // Button Add Task
  $("#btnAddTask").dxButton({
    icon: "fas fa-tasks",
    hint: "Add New List",
    onClick: function (e) {
      addTask();
    }
  });

  // Button Add Task
  $("#btnAddList").dxButton({
    icon: "fas fa-th-list",
    hint: "Add New List",
    onClick: function (e) {
      addTask();
    }
  });

  kanbanPanel();



});


// Script to render Kanban cards and lists
function kanbanPanel() {
  var retTasks = $.getJSON(urlREST + "/kanban")
    .done(function () {
      var tasks = retTasks.responseJSON;
      var statuses = [
        "Backlog",
        "To-Do",
        "In-Progress",
        "Done",
        "Accepted"
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

              var taskDetails = [{
                "ID": task.ID,
                "TaskName": task.TaskName,
                "StartDate": task.StartDate,
                "DueDate": task.DueDate,
                "Progress": task.Progress,
                "Priority": task.Priority,
                "Status": task.Status,
                "ProjectId": task.ProjectId,
                "AssignedUser": parseInt(task.AssignedUser)
              }];

              //console.log(taskDetails[0]);

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
                    editorType: "dxDateBox",
                    editorOptions: {
                      disabled: true
                    }
                  },
                  {
                    dataField: "DueDate",
                    editorType: "dxDateBox",
                    editorOptions: {
                      disabled: true
                    }
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
                      disabled: true,
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
                      disabled: true,
                      dataSource: {
                        store: new DevExpress.data.CustomStore({
                          key: "ID",
                          loadMode: "raw",
                          load: function () {
                            return sendRequest(urlREST + "/user/lookup");
                          }
                        })
                      },
                      valueExpr: "ID",
                      displayExpr: "userName"
                    },
                    validationRules: [{
                      type: "required"
                    }]
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
                          DevExpress.ui.notify("Task saved", "success", 3000);
                          location.reload();
                        });
                      }
                    }
                  }
                ]
              }).dxForm("instance");

            }
          })
          .appendTo($container);

        var user = users.filter(function (user) {
          return user.ID == task.AssignedUser;
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
          .text(user.userName)
          .appendTo($item);

      }
    })
    .fail(function () {
      console.log("error");
    });
}

var users = $.getJSON(urlREST + "/user/lookup", function (usersJSON) {
  users = usersJSON.data;
});

var selectBoxStatus = [{
    id: 1,
    name: "Backlog"
  },
  {
    id: 2,
    name: "To-Do"
  },
  {
    id: 3,
    name: "In-Progress"
  },
  {
    id: 4,
    name: "Done"
  },
  {
    id: 5,
    name: "Accepted"
  }
];