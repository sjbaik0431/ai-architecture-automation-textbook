import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/"assets"
OUT.mkdir(exist_ok=True)
# Dedicated educational scene: existing user scenes are preserved.
scene=bpy.data.scenes.new("AA_Education")
bpy.context.window.scene=scene
scene.unit_settings.system="METRIC"
scene.unit_settings.scale_length=1.0
P=json.loads((ROOT/"examples"/"project.json").read_text(encoding="utf-8"))
W,D,N,H=P["width_m"],P["depth_m"],P["floors"],P["floor_height_m"]
assert 0<W<=P["site_width_m"] and 0<D<=P["site_depth_m"]
assert isinstance(N,int) and 1<=N<=20 and 2<=H<=6
def mat(name,color,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get("Principled BSDF");bs.inputs["Base Color"].default_value=(*color,1)
 bs.inputs["Metallic"].default_value=metal;bs.inputs["Roughness"].default_value=.45
 return m
white=mat("AA_Concrete",(.72,.77,.75))
glass=mat("AA_Glass_Diagram",(.055,.18,.22),.35)
ground=mat("AA_Site",(.16,.23,.25))
accent=mat("AA_Accent",(.16,.56,.44))
def box(name,loc,size,material):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
 o=bpy.context.object;o.name=name;o.dimensions=size
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(material);return o
box("SITE",(0,0,-.18),(30,24,.3),ground)
for f in range(N):
 z=f*H
 box("SLAB_"+str(f+1),(0,0,z+.12),(W+.6,D+.6,.24),white)
 box("MASS_"+str(f+1),(0,0,z+H/2),(W,D,H-.24),glass)
 for x in [-W/2+i*3 for i in range(int(W/3)+1)]:
  for y in [-D/2-.03,D/2+.03]:box("MULLION",(x,y,z+H/2),(.12,.12,H-.24),white)
 for y in [-D/2+i*3 for i in range(int(D/3)+1)]:
  for x in [-W/2-.03,W/2+.03]:box("MULLION",(x,y,z+H/2),(.12,.12,H-.24),white)
box("ROOF",(0,0,N*H),(W+.6,D+.6,.3),white)
box("ENTRY",(0,-D/2-1.1,.15),(5,2,.3),accent)
# Grid paths, for context only.
for x in [-12,12]:box("PATH",(x,0,.005),(1.2,22,.02),white)
world=bpy.data.worlds.new("AA_World");scene.world=world;world.use_nodes=True
world.node_tree.nodes["Background"].inputs[0].default_value=(.18,.24,.3,1)
world.node_tree.nodes["Background"].inputs[1].default_value=.5
ld=bpy.data.lights.new("AA_Key","AREA");lo=bpy.data.objects.new("AA_Key",ld);scene.collection.objects.link(lo)
lo.location=(4,-10,25);ld.energy=2500;ld.shape="DISK";ld.size=18
lo.rotation_euler=(Vector((0,0,0))-lo.location).to_track_quat("-Z","Y").to_euler()
sun=bpy.data.lights.new("AA_Sun","SUN");so=bpy.data.objects.new("AA_Sun",sun);scene.collection.objects.link(so)
so.rotation_euler=(.4,-.5,-.5);sun.energy=2
cam=bpy.data.cameras.new("AA_Camera");co=bpy.data.objects.new("AA_Camera",cam);scene.collection.objects.link(co);scene.camera=co
co.location=(33,-39,30);co.rotation_euler=(Vector((0,0,4))-co.location).to_track_quat("-Z","Y").to_euler()
cam.type="ORTHO";cam.ortho_scale=48
scene.render.engine="CYCLES";scene.cycles.samples=24
scene.render.resolution_x=1280;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG";scene.render.filepath=str(OUT/"blender-aerial.png")
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/"training-building.blend"))
bpy.ops.render.render(write_still=True)
# A top projection is explicitly not a cut plan.
co.location=(0,0,55);co.rotation_euler=(0,0,0);cam.ortho_scale=36
scene.render.filepath=str(OUT/"blender-top.png");bpy.ops.render.render(write_still=True)
report={"engine":"Blender "+bpy.app.version_string,"input":P,"computed":{"footprint_m2":W*D,"floor_area_sum_m2":W*D*N,"height_m":N*H},"objects":len(scene.objects),"note":"Conceptual mass. Not construction or permit drawings."}
(OUT/"validation.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print("AA_RENDER_COMPLETE",report["computed"])
