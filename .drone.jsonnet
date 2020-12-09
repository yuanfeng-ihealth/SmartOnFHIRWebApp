local publish_npm_image(branch, name, image, when) = {
    name: name,
    image: image,
    pull: "if-not-exists",
    settings:{
        username:{
          from_secret: "DOCKERHUB_USERNAME",
        },
        password:{
          from_secret: "DOCKERHUB_PASSWORD",
        },
        repo: "unifiedcaredocker/npm",
        tags: "latest",
        dockerfile: "./Dockerfile_npm"
    },
    when: when
};

local build(branch, name, image, when) = {
    name: name,
    image: image,
    commands: [
        'nodejs -v',
        'ls -lrth',
        'npm install',
        'CI=false npm run build',
        'aws s3 sync ./build s3://smart-on-fhir',

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
        publish_npm_image(branch, "Publish NPM Image", "plugins/docker", {instance: instance, event: ["push"]}),
        build(branch, "Build", "unifiedcaredocker/npm", {instance: instance, event: ["push"]}),
        deploy(branch, "Deploy", "unifiedcaredocker/npm", {instance: instance, event: ["push"]})
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