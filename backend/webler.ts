#!/usr/bin/env ts-node

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import * as m from "./ts/src/cli/manageGuest";


const argv = yargs(hideBin(process.argv))
      // launch an activity
      // options: [docker, server, devserver]
    .command('launch [what]', 'Launch an activity', (yargs) => {
        return yargs.positional('what', {
          describe: 'What to launch',
          type: 'string',
          default: 'docker'
        });
      }, m.launchWithOption_1)

      // build an activity
      .command('build [what]', 'Build an activity', (yargs) => {
        return yargs.positional('what', {
          describe: 'What to build',
          type: 'string',
          default: 'typescript'
        });
      }, m.buildWithOption_1)

      // open a shell
    .command('shell [what]', 'Open command line for docker', (yargs) => {
        return yargs.positional('what', {
          describe: 'Name of shell to launch',
          type: 'string',
          default: 'docker-backend'
        });
      }, m.launchShellWithOption_1)

      // test
    .command('test [directory]', 'Test the project', (yargs) => {
      return yargs.positional('directory', {
        describe: 'Name of directory to test',
        type: 'string',
        default: ''
      });
    }, m.testWithOption_1)

        // test
      .command('-test [description]', 'Test the project', (yargs) => {
        return yargs.positional('description', {
          describe: 'description of the test to run',
          type: 'string',
          default: ''
        });
      }, m.testWithDescription)

    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .argv;