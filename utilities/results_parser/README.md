# Results Parser
This tool is used to reformat the data, related to a benchmarked experiment, produced by BenchmarkFramework, to the representation, which is accepted by Experiment Knowledge Service.

## Prerequisites
1.Installed [NodeJS](https://nodejs.org/en/)
2.Installed [npm](https://www.npmjs.com/)

## Installing
Install the required dependencies with:
```
npm install
```
Then you can proceed towards building the project by running:
```
npm run build
```
## Running the tests
```
npm run test
```
## Running
Run the following command with listed arguments.
```
npm run start inputFilePath.json outputFilePath.json
```
- inputFilePath.json - a path to json file, as produced by BenchmarkFramework, representing an outcome of a Benchmark
- outputFilePath.json - is path to a file produced by this tool, representing a benchmarked experiment, as accepted by Experiment Knowledge Service.
## Built With

* [NodeJS](https://nodejs.org/en/) - Execution Environment
* [NPM](https://www.npmjs.com/) - Dependency Management
*  [Typescript](https://www.typescriptlang.org/)


## License

Copyright 2019-, by Service Engineering Analytics team (rdsea.github.io).
Licensed under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0).