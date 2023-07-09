const fs = require("fs");

class Graph {
  constructor(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
  }

  mergeVertices(vertexA, vertexB) {
    const mergedVertexLabel = `${vertexA}-${vertexB}-merged`;

    const vertexAEdges = this.edges.get(vertexA);
    const vertexBEdges = this.edges.get(vertexB);

    const mergedEdges = [...vertexAEdges, ...vertexBEdges].filter(
      (connectedVertex) =>
        connectedVertex !== vertexA && connectedVertex !== vertexB
    );

    this.edges.delete(vertexA);
    this.edges.delete(vertexB);
    this.edges.set(mergedVertexLabel, mergedEdges);

    mergedEdges.forEach((vertex) => {
      if (vertex === vertexA || vertex === vertexB) return;

      let vertexEdges = this.edges.get(vertex);

      vertexEdges = vertexEdges.map((connectedVertex) =>
        connectedVertex === vertexA || connectedVertex === vertexB
          ? mergedVertexLabel
          : connectedVertex
      );

      this.edges.set(vertex, vertexEdges);
    });

    this.vertices = this.vertices.filter(
      (vertex) => vertex !== vertexA && vertex !== vertexB
    );
    this.vertices = [...this.vertices, mergedVertexLabel];
  }

  findMinCut() {
    while (this.vertices.length > 2) {
      const randomVertexA =
        this.vertices[Math.floor(Math.random() * this.vertices.length)];
      const vertexAEdges = this.edges.get(randomVertexA);

      if (!vertexAEdges.length) {
        throw new Error(
          `Vertex: ${randomVertexA} doesn't contain any edges connected to it!`
        );
      }

      const randomVertexB =
        vertexAEdges[Math.floor(Math.random() * vertexAEdges.length)];

      this.mergeVertices(randomVertexA, randomVertexB);
    }

    return this.edges.get(this.vertices[0]).length;
  }

  static createFromFile() {
    try {
      let input = fs.readFileSync("./karger-min-cut-problem-input.txt", "utf8");

      const rows = input
        .split("\n")
        .filter((row) => !!row.length)
        .map((row) =>
          row
            .split(/\s+/)
            .map((vertex) => parseInt(vertex, 10))
            .filter((vertex) => !isNaN(vertex))
        );

      const vertices = rows.map((row) => row[0]);

      const edges = new Map(
        rows.map((row) => [row[0], row.filter((_, index) => index !== 0)])
      );

      return new Graph(vertices, edges);
    } catch (err) {
      if (
        err instanceof SyntaxError &&
        err.message.includes("is not valid JSON")
      ) {
        throw new Error(
          `Invalid arguments: Only valid array are allowed!\nFor example: [2, 3, 1, 5, 4] `
        );
      }

      throw err;
    }
  }
}

function main() {
  let n = 1000;
  let currentSmallestCut = Number.MAX_SAFE_INTEGER;

  while (n >= 0) {
    n--;
    const graph = Graph.createFromFile();
    const minCut = graph.findMinCut();

    if (minCut < currentSmallestCut) {
      currentSmallestCut = minCut;
    }
  }

  console.log(`IN 1000 iteration, the smallest cut is: ${currentSmallestCut}`);
}

main();
