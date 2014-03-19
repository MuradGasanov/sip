# -*- coding: utf-8 -*-
from symbol import return_stmt
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseForbidden
import main.models as models
import json


def index(r):
    return render_to_response("index_map.html")


def admin(r):
    return render_to_response("admin_map.html")


class Points():
    def __init__(self):
        pass

    @staticmethod
    def read(r):
        points = models.Points.objects.all()
        items = []
        for point in points:
            item = {
                "id": point.id,
                "name": point.name,
                "x": point.x,
                "y": point.y,
                "state": point.state,
                "instruction_title": point.instruction_title,
                "instruction_text": point.instruction_text
            }
            items.append(item)
        if items:
            js = json.dumps(items)
        else:
            js = ""
        return HttpResponse(js, content_type="application/json")

    @staticmethod
    def create(r):
        items = json.loads(r.POST.get("item"))
        for i in items:
            if i in ("name", "x", "y", "state") and items[i] == "":  # required field
                return HttpResponseForbidden()
        new_point = models.Points.objects.create(
            name=items.get("name"),
            x=int(items.get("x")),
            y=int(items.get("y")),
            state=items.get("state"),
            instruction_title="",
            instruction_text=""
        )
        if new_point:
            js = json.dumps({
                "id": new_point.id,
                "name": new_point.name,
                "x": new_point.x,
                "y": new_point.y,
                "state": new_point.state,
                "instruction_title": new_point.instruction_title,
                "instruction_text": new_point.instruction_text
            })
            return HttpResponse(js, content_type="application/json")
        else:
            return HttpResponseForbidden()

    @staticmethod
    def update(r):
        items = json.loads(r.POST.get("item"))
        for i in items:
            if i in ("id", "name", "x", "y", "state") and items[i] == "":  # required field
                return HttpResponseForbidden()
        point = models.Points.objects.get(id=int(items.get("id")))
        point.name = items.get("name")
        point.x = items.get("x")
        point.y = items.get("y")
        point.state = items.get("state")
        point.save()
        js = json.dumps({
            "id": point.id,
            "name": point.name,
            "x": point.x,
            "y": point.y,
            "state": point.state,
            "instruction_title": point.instruction_title,
            "instruction_text": point.instruction_text
        })
        if js:
            return HttpResponse(js, content_type="application/json")
        else:
            return HttpResponse("", content_type="application/json")

    @staticmethod
    def destroy(r):
        item = json.loads(r.POST.get("item"))
        models.Points.objects.get(id=int(item.get("id"))).delete()
        return HttpResponse(json.dumps({}), content_type="application/json")
    #
    # @staticmethod
    # def update_info(r):
    #     items = json.loads(r.POST.get("item"))
    #     point_id = items.get("id")
    #     if point_id:
    #         point = models.Points.objects.get(id=int(point_id))
    #         point.info.clear()
    #         point.info.add(*items.get("new_info"))
    #         return HttpResponse("ok", content_type="application/json")
    #     else:
    #         return HttpResponse("id undefined", content_type="application/json")

    @staticmethod
    def set_instruction(r):
        items = json.loads(r.POST.get("item"))
        point_id = int(items.get("id"))

        if not point_id:
            return HttpResponseForbidden()

        point = models.Points.objects.get(id=point_id)

        point.instruction_title = items.get("instruction_title")
        point.instruction_text = items.get("instruction_text")
        point.save()

        return HttpResponse(json.dumps({"status": "ok"}), content_type="application/json")

    @staticmethod
    def state_update(point_id):
        states = [i[0] for i in models.Info.objects.filter(point_id=point_id).values_list("state")]
        point = models.Points.objects.get(id=point_id)
        if "red" in states:
            point.state = "red"
            point.save()
            return
        elif "yellow" in states:
            point.state = "yellow"
            point.save()
            return
        else:
            point.state = "green"
            point.save()
            return


class Info():
    def __init__(self):
        pass

    @staticmethod
    def read(r):
        item = json.loads(r.body)
        if "point_id" not in item:
            return HttpResponseForbidden()

        point_id = int(item.get("point_id"))
        item = list(models.Info.objects.filter(point_id=point_id).values("id", "title", "state", "level"))
        if item:
            js = json.dumps(item)
        else:
            js = [{}]  # FIXME: выводит как пустую запись
        return HttpResponse(js, content_type="application/json")

    @staticmethod
    def create(r):
        items = json.loads(r.POST.get("item"))
        for i in items:
            if i != "id" and not items[i]:
                return HttpResponseForbidden()
        new_info = models.Info.objects.create(
            title=items.get("title"),
            state=items.get("state"),
            level=items.get("level"),
            point_id=int(items.get("point_id"))
        )
        point = models.Points.objects.get(id=int(items.get("point_id")))
        if point.state == "green":
            point.state = new_info.state
            point.save()
        Points.state_update(int(items.get("point_id")))
        if new_info:
            js = json.dumps({
                "id": new_info.id,
                "title": new_info.title,
                "level": new_info.level,
                "point_id": new_info.point_id,
                "state": new_info.state
            })
            return HttpResponse(js, content_type="application/json")
        else:
            return HttpResponseForbidden()

    @staticmethod
    def update(r):
        items = json.loads(r.POST.get("item"))
        for i in items:
            if items[i] == "":
                return HttpResponseForbidden()
        info = models.Info.objects.get(id=int(items.get("id")))

        info.title = items.get("title")
        info.level = items.get("level")
        info.state = items.get("state")
        info.save()

        Points.state_update(info.point_id)

        js = json.dumps({
            "id": info.id,
            "title": info.title,
            "level": info.level,
            "state": info.state
        })
        if js:
            return HttpResponse(js, content_type="application/json")
        else:
            return HttpResponse("", content_type="application/json")

    @staticmethod
    def destroy(r):
        item = json.loads(r.POST.get("item"))
        info = models.Info.objects.get(id=int(item.get("id")))
        point_id = info.point_id
        info.delete()
        Points.state_update(point_id)
        return HttpResponse(json.dumps({}), content_type="application/json")


class Point:
    def __init__(self):
        pass

    @staticmethod
    def read(r):
        items = list(models.Point.objects.all()
                     .values("id", "lt", "ln", "name", "info", "type"))
        if items:
            return HttpResponse(json.dumps(items), content_type="application/json")
        else:
            return HttpResponse("", content_type="application/json")
