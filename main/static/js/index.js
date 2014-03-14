/**
 * Created by murad on 12.03.14.
 */
$(document).ready(function () {

    var tooltip = $("#map").kendoTooltip({
        filter: "a",
        width: 120,
        position: "top"
    }).data("kendoTooltip");


    var OPTIONS = {
        id: 0,
        points: [],
        info: []
    };
    var last_selected = "";

    function point_render() {
        $.post("/admin/points/read/",
            {},
            function(r) {
//                console.log(r);
                var old_points = OPTIONS.points;
                OPTIONS.points = r;
                for (var i=0; i<OPTIONS.points.length; i++) {
                    var includes = $.grep(old_points, function(o) {
                        return o.id == OPTIONS.points[i].id;
                    });
                    if (includes.length == 0) {
                        $("<a href='#'>")
                            .attr({
                                title: OPTIONS.points[i].name,
                                "data-id": OPTIONS.points[i].id,
//                                id: "point_"+points[i].id,
                                class: OPTIONS.points[i].state
                            })
                            .css({
                                top: OPTIONS.points[i].y,
                                left: OPTIONS.points[i].x
                            }).appendTo("#map");
                    } else {
                        if (includes[0].state != OPTIONS.points[i].state) {
                            var p = $("#map").find("a[data-id="+OPTIONS.points[i].id+"]");
                            p.attr("class", OPTIONS.points[i].state);
                        }
                    }
                }
            }, "json")
    }

    setInterval(point_render, 2000);

    point_render();

    function info_render() {
        if (OPTIONS.id == 0) return false;
        $.post("/admin/info/read/", JSON.stringify({point_id: OPTIONS.id}), function(r) {
            var infoTemplate = kendo.template($("#infoTemplate").html());
            var point = $.grep(OPTIONS.points, function(o) {
                return o.id == OPTIONS.id;
            });
            if (point.length > 0) {
                point = point[0];
                var data = {
                    city: point.name,
                    info: r,
                    state: point.state,
                    instruction_title: point.instruction_title,
                    instruction_text: point.instruction_text
                };
                $(".main").html(infoTemplate(data));
            }
        }, "json");
    }
    setInterval(info_render, 2000);

    $("#map").on("click", "a", function () {
        console.log("clicked");
        var that = $(this);
        OPTIONS.id = that.data("id");
    });
});