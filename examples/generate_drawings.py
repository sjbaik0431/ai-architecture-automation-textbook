"""Generate concept site plan, elevation and section from project.json. Python 3, no packages."""
import json
from pathlib import Path
P=Path(__file__).resolve().parent
p=json.loads((P/"project.json").read_text(encoding="utf-8"))
out=P.parent/"assets";out.mkdir(exist_ok=True)
w,d,n,h=p["width_m"],p["depth_m"],p["floors"],p["floor_height_m"]
assert 0<w<=p["site_width_m"] and 0<d<=p["site_depth_m"] and 1<=n<=20
def doc(title,parts):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="720" viewBox="0 0 1000 720"><rect width="1000" height="720" fill="#fff"/><g font-family="sans-serif" fill="#112436"><text x="50" y="55" font-size="26">{title}</text><text x="50" y="85" font-size="15">AA-DEMO-001 / r01 / CONCEPT ONLY / dimensions in m</text>{"".join(parts)}<text x="50" y="680" font-size="14">Educational geometry exercise. Not permit or construction drawings. Scale is not guaranteed on screen.</text></g></svg>'
def rect(x,y,w,h,fill="none",sw=2):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="#183e50" stroke-width="{sw}"/>'
def line(x,y,x2,y2):
 return f'<path d="M{x},{y} L{x2},{y2}" fill="none" stroke="#315a68" stroke-width="1.5"/>'
def text(x,y,t,size=17):
 return f'<text x="{x}" y="{y}" font-size="{size}">{t}</text>'
def dim(x,y,x2,y2,t):
 return line(x,y,x2,y2)+line(x-5,y-6,x+5,y+6)+line(x2-5,y2-6,x2+5,y2+6)+text((x+x2)/2+6,(y+y2)/2-9,t,15)
s=16;cx,cy=500,370;sw,sd=p["site_width_m"]*s,p["site_depth_m"]*s
parts=[rect(cx-sw/2,cy-sd/2,sw,sd,"#f1f5f6"),rect(cx-w*s/2,cy-d*s/2,w*s,d*s,"#d3e9e3",3),text(cx-w*s/2+20,cy,"BUILDING FOOTPRINT"),text(cx-w*s/2+20,cy+30,f"{w*d:g} m2 / {n} floors"),dim(cx-w*s/2,cy-d*s/2-28,cx+w*s/2,cy-d*s/2-28,str(w)+" m"),dim(cx+w*s/2+28,cy-d*s/2,cx+w*s/2+28,cy+d*s/2,str(d)+" m"),line(850,220,850,140),line(850,140,842,155),line(850,140,858,155),text(844,127,"N"),text(55,620,f"Site: {p['site_width_m']} x {p['site_depth_m']} m / floor area sum: {w*d*n:g} m2")]
(out/"concept-plan.svg").write_text(doc("A-001 / CONCEPT SITE PLAN",parts),encoding="utf-8")
s=min(30,420/(n*h));x=(1000-w*s)/2;y=570
parts=[rect(x,y-n*h*s,w*s,n*h*s,"#e4f1ee",3),line(80,y,920,y)]
for f in range(n+1):
 yy=y-f*h*s
 parts+=[line(x,yy,x+w*s,yy),text(x+w*s+15,yy+5,f"+{f*h:.2f} m",15)]
 for i in range(1,int(w/3)+1):
  if f<n:parts.append(line(x+i*3*s,yy,x+i*3*s,yy-h*s))
parts+=[dim(x,y+35,x+w*s,y+35,f"{w:g} m"),text(55,135,"Facade divisions are schematic, not a window schedule.")]
(out/"concept-elevation.svg").write_text(doc("A-201 / CONCEPT ELEVATION",parts),encoding="utf-8")
parts=[line(80,y,920,y)]
for f in range(n+1):
 yy=y-f*h*s
 parts+=[rect(x,yy-7,w*s,7,"#153e4c"),text(x+w*s+15,yy+5,f"+{f*h:.2f} m",15)]
parts+=[rect(x,y-n*h*s,8,n*h*s,"#153e4c"),rect(x+w*s-8,y-n*h*s,8,n*h*s,"#153e4c"),text(55,135,"Concept floor levels only. Stairs, structure and services are not designed."),dim(x-40,y,x-40,y-n*h*s,f"{n*h:g} m")]
(out/"concept-section.svg").write_text(doc("A-301 / CONCEPT SECTION",parts),encoding="utf-8")
print("Generated 3 concept SVG drawings",w,d,n,h)
