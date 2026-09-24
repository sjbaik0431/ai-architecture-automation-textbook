# SketchUp desktop Ruby Console: load 'C:/.../sketchup_build.rb'
# Original educational example. Conceptual mass only.
module AATraining
 def self.build
  model=Sketchup.active_model
  existing=model.entities.grep(Sketchup::Group).find{|g|g.name=='AA_DEMO_BUILDING'}
  raise 'AA_DEMO_BUILDING already exists. Use a fresh training model.' if existing
  width=18.0; depth=12.0; floors=3; height=3.6
  raise 'Invalid dimensions' unless width>0 && depth>0 && floors.between?(1,20) && height>0
  started=false
  begin
   model.start_operation('AA Training Mass',true);started=true
   root=model.entities.add_group;root.name='AA_DEMO_BUILDING'
   floors.times do |i|
    group=root.entities.add_group;group.name="FLOOR_#{i+1}"
    z=(i*height).m
    pts=[[-width/2.0,-depth/2.0],[width/2.0,-depth/2.0],[width/2.0,depth/2.0],[-width/2.0,depth/2.0]].map{|x,y|[x.m,y.m,z]}
    face=group.entities.add_face(pts)
    raise 'Face creation failed' unless face
    face.reverse! if face.normal.z<0
    face.pushpull(height.m)
   end
   model.commit_operation;started=false
   model.active_view.zoom(root)
   puts "AA COMPLETE: width=#{width}m depth=#{depth}m height=#{floors*height}m; conceptual mass"
  rescue => e
   model.abort_operation if started
   raise e
  end
 end
end
AATraining.build
