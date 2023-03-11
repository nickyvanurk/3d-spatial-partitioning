import * as THREE from 'three';
import * as utils from './utils';
import { Fleet } from './fleet';
import { Station } from './station';
import { Context } from './types';
import { Ship } from './ship';
import { Asteroid } from './asteroid';
import { Vector3 } from '../../engine/src/math/vector';

export class World {
    ctx: Context;
    station: Station;
    fleet: Fleet;
    ship: Ship;
    asteroid: Asteroid;

    constructor(ctx: Context) {
        this.ctx = ctx;

        ctx.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.setScalar(1);
        ctx.scene.add(dirLight);

        const stars = utils.createPointCloudSphere(1000, 6000, 2000, 12.5, 0xffffff, false);
        ctx.scene.add(stars);

        // this.station = new Station(ctx);
        // this.station.position.y = 100;
        // this.station.rotation.x = -0.05;
        // this.station.rotation.z = -0.05;

        // this.fleet = new Fleet(ctx, 50, 1000);

        this.ship = new Ship(ctx, new Vector3(-50, 0, 0));
        this.asteroid = new Asteroid(ctx, new Vector3(50, 0, 0));
    }

    update(dt: number) {
        // this.station.update(dt);
        // this.fleet.update(dt);

        this.ship.arrive(this.asteroid.position);

        this.ship.update(dt);
        this.asteroid.update(dt);
    }

    render(alpha: number, dt: number) {
        // this.station.render(alpha, dt);
        // this.fleet.render(alpha);

        this.ship.render(alpha, dt);
        this.asteroid.render(alpha, dt);
    }
}
