import {DependencyInjection} from "../../main/DependencyInjection";
import {
    IDeploymentPatternService,
    IExperimentService,
    IRecommendationService,
    ITopologyService
} from "../../main/service/interfaces";
import {MongoDb} from "../../main/repository/MongoDb";
import {DeploymentPattern, NodeType, PureEdge, PureRSU, PureVehicle} from "../../main/model/dtos";


const assert = require('assert');

describe('RecommendationService tests', () => {

    let dependecnyInjection: DependencyInjection = new DependencyInjection();
    let topologyService: ITopologyService = null;
    let experimentService: IExperimentService = null;
    let depPatternService: IDeploymentPatternService = null;
    let recommendationService: IRecommendationService = null;

    before(async () => {
        let mongoDb: MongoDb = await dependecnyInjection.createMongoDB();
        await mongoDb.createConnection();
        topologyService = dependecnyInjection.createTopologyService();
        experimentService = dependecnyInjection.createExperimentService();
        depPatternService = dependecnyInjection.createDeploymentPatternService();
        recommendationService = dependecnyInjection.createRecommendationService();
    });

    after(async () => {
        // close db connection
        await dependecnyInjection.createGraphAPI().closeConnection();
        let mongoDb: MongoDb = await dependecnyInjection.createMongoDB();
        await mongoDb.closeConnection();
    });

    afterEach(async () => {
        let mongoDb: MongoDb = await dependecnyInjection.createMongoDB();
        await mongoDb.getDb().dropDatabase();
        await dependecnyInjection.createGraphAPI().makeGraphRequest('MATCH (n) DETACH DELETE n');
    });

    it('findMostSimilarDeploymentPatternShouldReturnNull', async () => {

        let mostSimilar: DeploymentPattern = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternLarge1().structure);
        assert(mostSimilar == null);

    });

    it('findMostSimilarDeploymentPatternShouldReturnPatternEqual', async () => {

        let small1: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall1());
        let small2: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall2());
        let small3: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall3());
        let large1: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge1());
        let large2: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge2());
        let large3: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge3());

        let mostSimilar: DeploymentPattern = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternSmall1().structure);
        assert(mostSimilar._id == small1._id);

        mostSimilar = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternSmall2().structure);
        assert(mostSimilar._id == small2._id);

        mostSimilar = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternSmall3().structure);
        assert(mostSimilar._id == small3._id);

        mostSimilar = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternLarge1().structure);
        assert(mostSimilar._id == large1._id);

        mostSimilar = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternLarge2().structure);
        assert(mostSimilar._id == large2._id);

        mostSimilar = await recommendationService.findMostSimilarDeploymentPattern(createDeploymentPatternLarge3().structure);
        assert(mostSimilar._id == large3._id);
    });

    it('findMostSimilarDeploymentPatternShouldReturnSimilar', async () => {

        let small1: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall1());
        let small2: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall2());
        let small3: DeploymentPattern = await depPatternService.create(createDeploymentPatternSmall3());
        let large1: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge1());
        let large2: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge2());
        let large3: DeploymentPattern = await depPatternService.create(createDeploymentPatternLarge3());

        let structure: PureEdge = {
            nodeType: NodeType.edge,
            name: 'edge1',
            peers: []
        };

        let rsu: PureRSU = {
            nodeType: NodeType.rsu,
            name: 'rsu1',
            peers: []
        };

        let rsu2: PureRSU = {
            nodeType: NodeType.rsu,
            name: 'rsu2',
            peers: []
        };

        let vehicle: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: 'vehicle1',
            peers: []
        };

        rsu2.peers.push(vehicle);
        rsu.peers.push(rsu2);
        structure.peers.push(rsu);

        let mostSimilar: DeploymentPattern = await recommendationService.findMostSimilarDeploymentPattern(structure);
        assert(mostSimilar);
        assert(mostSimilar._id == small3._id);

    });

});


export function createDeploymentPatternSmall1(): DeploymentPattern {

    let mainNode: PureRSU = {
        name: "rsu2",
        nodeType: NodeType.rsu,
        peers: []
    };

    for (let i = 0; i < 2; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };

        mainNode.peers.push(peerNode);
    }

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern small 1',
        structure: mainNode
    };

    return deploymentPattern;
}

export function createDeploymentPatternLarge1(): DeploymentPattern {

    let mainNode: PureRSU = {
        name: "rsu2",
        nodeType: NodeType.rsu,
        peers: []
    };

    for (let i = 0; i < 48; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };

        mainNode.peers.push(peerNode);
    }

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern for Scenario 2 Case 2 Large scale',
        structure: mainNode
    };

    return deploymentPattern;
}

export function createDeploymentPatternSmall2(): DeploymentPattern {

    let mainNode: PureEdge = {
        name: "edge1",
        nodeType: NodeType.edge,
        peers: []
    };

    for (let i = 0; i < 2; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };

        mainNode.peers.push(peerNode);
    }

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern for Scenario 2 Case 3 Small scale',
        structure: mainNode
    };

    return deploymentPattern;
}

export function createDeploymentPatternLarge2(): DeploymentPattern {

    let mainNode: PureEdge = {
        name: "edge1",
        nodeType: NodeType.edge,
        peers: []
    };

    for (let i = 0; i < 48; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };

        mainNode.peers.push(peerNode);
    }

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern for Scenario 2 Case 3 Large scale',
        structure: mainNode
    };

    return deploymentPattern;
}

export function createDeploymentPatternSmall3(): DeploymentPattern {

    let mainNode: PureEdge = {
        name: "edge1",
        nodeType: NodeType.edge,
        peers: []
    };

    let rsuNode1: PureRSU = {
        name: "rsu1",
        nodeType: NodeType.rsu,
        peers: []
    };

    let rsuNode2: PureRSU = {
        name: "rsu2",
        nodeType: NodeType.rsu,
        peers: []
    };

    let peerNode1: PureVehicle = {
        nodeType: NodeType.vehicle,
        name: `vehicle1`,
        peers: []
    };

    let peerNode2: PureVehicle = {
        nodeType: NodeType.vehicle,
        name: `vehicle2`,
        peers: []
    };

    rsuNode1.peers.push(peerNode1);
    rsuNode2.peers.push(peerNode2);

    mainNode.peers.push(rsuNode1);
    mainNode.peers.push(rsuNode2);

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern for Scenario 2 Case 4 Small scale',
        structure: mainNode
    };

    return deploymentPattern;
}

export function createDeploymentPatternLarge3(): DeploymentPattern {

    let mainNode: PureEdge = {
        name: "edge1",
        nodeType: NodeType.edge,
        peers: []
    };

    let rsuNode1: PureRSU = {
        name: "rsu1",
        nodeType: NodeType.rsu,
        peers: []
    };

    let rsuNode2: PureRSU = {
        name: "rsu2",
        nodeType: NodeType.rsu,
        peers: []
    };

    for (let i = 0; i < 24; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };
        rsuNode1.peers.push(peerNode);
    }

    for (let i = 24; i < 48; i++) {

        let peerNode: PureVehicle = {
            nodeType: NodeType.vehicle,
            name: `vehicle${i + 1}`,
            peers: []
        };
        rsuNode2.peers.push(peerNode);
    }

    mainNode.peers.push(rsuNode1);
    mainNode.peers.push(rsuNode2);

    let deploymentPattern: DeploymentPattern = {
        _id: null,
        name: 'Deployment pattern for Scenario 2 Case 4 Large scale',
        structure: mainNode
    };

    return deploymentPattern;
}