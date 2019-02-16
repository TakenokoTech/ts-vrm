$vrm_files = @(
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

$vrm_type_files = @(
    "vrm.schema",
    "vrm.blendshape.schema"
)

$glTF_files = @(
    "accessor.schema",
    "animation.channel.schema",
    "animation.channel.target.schema",
    "animation.parameter.schema",
    "animation.sampler.schema",
    "animation.schema",
    "arrayValues.schema",
    "asset.profile.schema",
    "asset.schema",
    "buffer.schema",
    "bufferView.schema",
    "camera.orthographic.schema",
    "camera.perspective.schema",
    "camera.schema",
    "extension.schema",
    "extras.schema",
    "glTF.schema",
    "glTFChildOfRootProperty.schema",
    "glTFProperty.schema",
    "glTFid.schema",
    "image.schema",
    "material.schema",
    "material.values.schema",
    "mesh.primitive.attribute.schema",
    "mesh.primitive.schema",
    "mesh.schema",
    "node.schema",
    "program.schema",
    "sampler.schema",
    "scene.schema",
    "shader.schema",
    "skin.schema",
    "technique.attribute.schema",
    "technique.parameters.schema",
    "technique.schema",
    "technique.states.functions.schema",
    "technique.states.schema",
    "technique.uniform.schema",
    "texture.schema"
)

$glTF_type_files = @(
    "glTF.schema"
    "material.schema"
)

New-Item "./UniVRM/" -type directory -Force 
Set-Location "./UniVRM/"
foreach ($file in $vrm_files) {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/dwango/UniVRM/master/specification/0.0/schema/$file.json" -OutFile "./$file.json"
}
foreach ($file in $vrm_type_files) {
    npx json2ts -i "./$file.json" -o "./$file.d.ts"
}
Set-Location "../"


New-Item "./glTF/" -type directory -Force 
Set-Location "./glTF/"
foreach ($file in $glTF_files) {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/KhronosGroup/glTF/master/specification/1.0/schema/$file.json" -OutFile "./$file.json"
}
foreach ($file in $glTF_type_files) {
    npx json2ts -i "./$file.json" -o "./$file.d.ts"
}
Set-Location "../"