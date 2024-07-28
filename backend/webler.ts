#!/usr/bin/env src-node

import path from "path";

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import * as m from "./ts/src/cli/manageGuest";


const argv = yargs(hideBin(process.argv))
    .command('seed db', 'Seed Database', {}, m.seedDatabase)
    .command('build', 'Building Typescript', {}, m.buildTypescript)
    .command('builddocker', 'Building Typescript', {}, m.buildDocker)
    .command('launchserver', 'Start the server', {}, m.startServer)
    .command('launchdevserver', 'Start the dev server', {}, m.devStartServer)
    .command('launchdocker', 'Launch Docker containers', {}, m.launchDocker)
    .command('launchdockerbackend', 'Launch Docker containers', {}, m.openCmdInBackendDockerContainer)
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;