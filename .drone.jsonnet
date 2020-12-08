local build(branch, name, image, when) = {
    name: name,
    image: image,
    commands: [
        'sudo apt update',
        'sudo apt install nodejs',
        'sudo apt install npm',
        'nodejs -v',
        'npm install',
        'npm run build',
    ],
    when: when
};

local deploy(branch, name, image, when) = {
    name: name,
    image: image,
    pull: "always",
    commands:[
        "aws s3 sync ./build s3://smart-on-fhir",
    ],
    environment:{
    },
    when: when
};

local pipeline(branch, instance) = {
    kind: 'pipeline',
    type: 'kubernetes',
    name: branch,
    steps: [
        build(branch, "Build", "ubuntu:bionic", {instance: instance, event: ["push"]}),
        deploy(branch, "Deploy", "ubuntu:bionic", {instance: instance, event: ["push"]})
    ],
    trigger:{
        branch: branch
    },
    image_pull_secrets: ["dockerconfigjson"]
};

local dev_drone = ["dev-drone.ihealth-eng.com"];
local test_drone = ["test-drone.ihealth-eng.com"];
local prod_drone = ["prod-drone.ihealth-eng.com"];

[
    pipeline(branch="dev", instance=dev_drone),
    pipeline(branch="test", instance=test_drone),
    pipeline(branch="prod", instance=prod_drone)
]