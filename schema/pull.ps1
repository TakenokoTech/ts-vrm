$files = @(
    "vrm.blendshape.bind.schema",
    "vrm.blendshape.group.schema",
    "vrm.blendshape.materialbind.schema",
    "vrm.blendshape.schema",
    "vrm.firstperson.degreemap.schema",
    "vrm.firstperson.meshannotation.schema",
    "vrm.firstperson.schema",
    "vrm.humanoid.bone.schema",
    "vrm.humanoid.schema",
    "vrm.material.schema",
    "vrm.meta.schema",
    "vrm.schema",
    "vrm.secondaryanimation.collidergroup.schema",
    "vrm.secondaryanimation.schema",
    "vrm.secondaryanimation.spring.schema"
) 

foreach ($file in $files) {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/dwango/UniVRM/master/specification/0.0/schema/$file.json" -OutFile "./$file.json"
    npx json2ts -i "./$file.json" -o "./$file.d.ts"
}