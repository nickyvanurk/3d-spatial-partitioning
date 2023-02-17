> **Note**
> This project is being developed further into a simulation. Its purpose is no longer to visualize the octree data structure, but instead become an awesome portfolio project.

# [3D Spatial Partitioning](http://nickyvanurk.com/boids-octree-simulation/)

A 3D [Boids](https://en.wikipedia.org/wiki/Boids) implementation to demonstrate **Spatial Partitioning** implemented with an **Octree**.

![](simulation.gif)

## Motivation

As I was programming my [3D browser shooter](https://github.com/nickyvanurk/3d-multiplayer-browser-shooter)
I was particularly unhappy the way I handle bullet / ship collisions. So I started looking
for a better solution, say hello to **Spatial Partitioning**! Instead of checking
every bullet against every ship (O(n^2)) you can instead split up the world in
partitions with the help of an octree. Every node in this tree represents a 3D
space and each space allows a maximum number of entities. If the number of entities
exceed the maximum, it splits the space into 8 smaller ones. It keeps doing this recursively.
Now, for every bullet you can query the tree for other ships in the same space (node)
instead of checking EVERY ship in the world. This makes this new method way more efficient (O(log n))
when handling a lot of entities.

## License

This project is licensed under the [MIT License](./LICENSE).
