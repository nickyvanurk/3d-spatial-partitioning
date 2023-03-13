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
    asteroids: Asteroid[];
    currentAsteroid = 0;
    home = new Vector3();

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

        this.ship = new Ship(ctx, new Vector3(0, 0, 0));
        // this.ship.velocity.y = 100;

        this.asteroids = [
            new Asteroid(ctx, new Vector3(50, 0, 50)),
            new Asteroid(ctx, new Vector3(-50, 0, 50)),
            new Asteroid(ctx, new Vector3(50, 0, -50)),
            new Asteroid(ctx, new Vector3(-50, 0, -50)),
        ];
    }

    update(dt: number) {
        // this.station.update(dt);
        // this.fleet.update(dt);

        const asteroid = this.asteroids[this.currentAsteroid];
        if (asteroid.resource > 0) {
            this.ship.mine(asteroid);
        } else if (this.currentAsteroid < this.asteroids.length - 1) {
            this.currentAsteroid++;
        } else {
            this.ship.arrive(this.home, 45, 0, 0.2);
        }

        this.ship.update(dt);
        for (const asteroid of this.asteroids) {
            asteroid.update(dt);
        }
    }

    render(alpha: number, dt: number) {
        // this.station.render(alpha, dt);
        // this.fleet.render(alpha);

        this.ship.render(alpha, dt);
        for (const asteroid of this.asteroids) {
            asteroid.render(alpha, dt);
        }
    }
}
