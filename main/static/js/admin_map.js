$(document).ready(function () {
    var BASE_URL = "/admin/";
    var GLOBAL_OPTION = {
        point_id: 0,
        point_info: []
    };

    var points_grid = $("#point_grid").kendoGrid({
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: BASE_URL + "points/read/",
                    dataType: "json",
                    type: "POST"
                },
                create: {
                    url: BASE_URL + "points/create/",
                    dataType: "json",
                    type: "POST"
                },
                update: {
                    url: BASE_URL + "points/update/",
                    dataType: "json",
                    type: "POST"
                },
                destroy: {
                    url: BASE_URL + "points/destroy/",
                    dataType: "json",
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options) {
                        return {item: kendo.stringify(options)};
                    }
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        name: {type: "string"},
                        x: {type: "string"},
                        y: {type: "string"},
                        state: {type: "string", defaultValue: "green"}
                    }
                }
            }
//            requestEnd: function (e) {
//                if (e.type == "destroy") {
//                    $reload_author.click();
//                }
//                n.close();
//            }
        },
        toolbar: [
            { name: "create", text: "Добавить" }
        ],
        height: 600,
        sortable: true,
        editable: {
            mode: "inline",
            confirmation: "Вы уверены, что хотите удалить запись?",
            confirmDelete: "Да",
            cancelDelete: "Нет"
        },
        columns: [
            { field: "name", title: "Название" },
            { field: "x", title: "X", width: "80px" },
            { field: "y", title: "Y", width: "80px" },
            { field: "state", title: "Состояние", width: "150px",
                template: "<span class='state #=state#'></span>",
                editor: state_editor },
            { command: [
                { name: "edit", text: {edit: "Редактировать", update: "Сохранить", cancel: "Отмена"}  },
                { name: "destroy", text: "Удалить" },
                { text: "Состояния", click: function (e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                    GLOBAL_OPTION.point_id = dataItem.id;
                    console.log("state click ", GLOBAL_OPTION);
                    index_grid.dataSource.read({point_id: GLOBAL_OPTION.point_id});
                    $("#info_modal").modal("show");
                    index_grid.element.find("div.k-grid-content").height(362); //FIXME: расчитывать это число
                }},
                { text: "Мероприятия", click: function (e) {
                    e.preventDefault();
                    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                    activity_model.set("id", dataItem.id);
                    activity_model.set("title", dataItem.instruction_title);
                    activity_model.set("text", dataItem.instruction_text);

                    console.log("activity click ", activity_model);
                    $("#activity_modal").modal("show");
                }}
            ], width: "550px", attributes: { style: "text-align: center;"} }
        ]
    }).data("kendoGrid");

    function state_editor(container, options) {
        $('<input data-text-field="text" data-value-field="id" data-bind="value:' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: false,
                dataSource: [
                    {text: "Зеленый", id: "green"},
                    {text: "Желтый", id: "yellow"},
                    {text: "Красный", id: "red"}
                ]
            });
    }


    var index_grid = $("#info_grid").kendoGrid({
        autoBind: false,
        dataSource: {
            type: "json",
            transport: {
                read: {
                    url: BASE_URL + "info/read/",
                    dataType: "json",
                    type: "POST"
                },
                create: {
                    url: BASE_URL + "info/create/",
                    dataType: "json",
                    type: "POST"
                },
                update: {
                    url: BASE_URL + "info/update/",
                    dataType: "json",
                    type: "POST"
                },
                destroy: {
                    url: BASE_URL + "info/destroy/",
                    dataType: "json",
                    type: "POST"
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options) {
                        options.point_id = GLOBAL_OPTION.point_id;
                        console.log(options, operation);
                        return {item: kendo.stringify(options)};
                    }
                    if (operation == "read") {
                        return kendo.stringify(options);
                    }
                }
            },
            schema: {
                model: {
                    id: "id",
                    fields: {
                        title: {type: "string"},
                        level: {type: "string"},
                        state: {type: "string", defaultValue: "green"}
                    }
                }
//                parse: function (response) {
//                    $.each(response, function (idx, item) {
//                        if (GLOBAL_OPTION.point_info.indexOf(item.id) != -1) {
//                            item.isChecked = true
//                        } else {
//                            item.isChecked = false
//                        }
//                    });
//                    console.log("parse ", response);
//                    return response;
//                }
            },
            requestEnd: function (e) {
                points_grid.dataSource.read();
            }
//            sync: function(e) {
//                console.log("sync complete ", index_grid.dataSource.data());
//            }
        },
        toolbar: [
            { name: "create", text: "Добавить" }
        ],
        height: 450,
        sortable: true,
        editable: {
            mode: "inline",
            confirmation: "Вы уверены, что хотите удалить запись?",
            confirmDelete: "Да",
            cancelDelete: "Нет"
        },
        columns: [
//            { field: "isChecked", title: " ",
//                template: "<input type='checkbox' class='on-check' data-bind='checked: isChecked' #= isChecked ? checked='checked' : ''#>",
//                width: "30px",
//                editor: function() {}
//            },
            { field: "title", title: "Название" },
            { field: "level", title: "Уровень", width: "80px"},
            { field: "state", title: "Состояние", width: "150px",
                template: "<span class='state #=state#'></span>",
                editor: state_editor },
            { command: [
                { name: "edit", text: {edit: "Редактировать", update: "Сохранить", cancel: "Отмена"} },
                { name: "destroy", text: "Удалить" }
            ], width: "300px", attributes: { style: "text-align: center;"} }
        ],
        dataBound: function (e) {
            console.log("dataBound");
            index_grid.element.find("div.k-grid-content").height(362);
        }
    }).data("kendoGrid");

//    index_grid.tbody.on("change", ".on-check", function (e) {
//        var row = $(e.target).closest("tr");
//        var item = index_grid.dataItem(row);
//        item.set("isChecked", $(e.target).is(":checked") ? true : false);
//    });

//    $("#info_save").click(function(e) {
//        e.preventDefault();
//        var info_ids = [];
//        var data = index_grid.dataSource.data();
//        for (var i=0; i<data.length; i++) {
//            if (data[i].isChecked) {
//                info_ids.push(data[i].id);
//            }
//        }
//        var sent = {
//            id: GLOBAL_OPTION.point_id,
//            new_info: info_ids
//        };
//        console.log("update info ",sent);
//        $.post(BASE_URL + "points/update_info/",
//            {item: JSON.stringify(sent)},
//            function(r) {
//                $("#info_modal").modal("hide");
//                console.log(r);
//            }, "json");
//
//    })

    var activity_model = kendo.observable({
        id: 0,
        title: "",
        text: ""
    });
    kendo.bind($("#activity_modal .modal-body"), activity_model);

    $("#activity_save").click(function (e) {
        e.preventDefault();
        var sent = {
            id: activity_model.get("id"),
            instruction_title: activity_model.get("title"),
            instruction_text: activity_model.get("text")
        };
        console.log("update info ", sent);
        $.post(BASE_URL + "points/set_instruction/",
            {item: JSON.stringify(sent)},
            function (r) {
                $("#activity_modal").modal("hide");
                points_grid.dataSource.read();
                console.log(r);
            }, "json");
    });
});