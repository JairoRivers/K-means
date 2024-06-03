// Classe que representa um ponto
class Point {
    constructor(x, y) {
        this.x = x;  // Coordenada X do ponto
        this.y = y;  // Coordenada Y do ponto
    }

    toString() {
        return `(${this.x}, ${this.y})`;  // Representação do ponto como string
    }
}

// Classe que representa um cluster
class Cluster {
    constructor(id, center) {
        this.id = id;  // Identificador do cluster
        this.center = center;  // Centro (ou centroid) do cluster
        this.points = [];  // Lista de pontos pertencentes ao cluster
    }

    limpaPontos() {
        this.points = [];  // Limpa a lista de pontos do cluster
    }

    addPonto(point) {
        this.points.push(point);  // Adiciona um ponto ao cluster
    }

    listaPontos() {
        return this.points.map(ponto => ponto.toString());  // Lista os pontos do cluster como strings
    }

    // Calcula a distância euclidiana do ponto para o centroide do cluster
    distanciaParaCentroid(point) {
        const dx = this.center.x - point.x;
        const dy = this.center.y - point.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    // Atualiza a posição do centroide com as médias das coordenadas X e Y dos pontos do cluster
    atualizaCentro() {
        let sum_x = 0;
        let sum_y = 0;

        for (const point of this.points) {
            sum_x += point.x;
            sum_y += point.y;
        }

        const num_points = this.points.length;
        if (num_points > 0) {
            const new_center_x = sum_x / num_points;
            const new_center_y = sum_y / num_points;
            this.center = new Point(new_center_x, new_center_y);
        }
    }
}

// Classe que implementa o algoritmo K-means
class KMeans {
    constructor(qtdCentroids) {
        this.k = qtdCentroids;  // Número de clusters
        this.points = [];  // Lista de todos os pontos
        this.clusters = [];  // Lista de clusters
    }

    run() {
        this.selecionarCentroidAleatorio();  // Seleciona centroides iniciais aleatórios

        let estaAtualizado = false;  // Variável para verificar se houve convergência

        while (!estaAtualizado) {
            const pA = this.getPointsFromClusters(); // Lista contendo pontos do centroide antes da atualização
            this.limpaCentroids(); // Limpa os pontos que pertencem ao centroide

            this.vinculaPontosAoCentroid(); // Vincula pontos ao cluster mais próximo
            this.attCentroid();  // Atualiza a posição dos centroides

            const pN = this.getPointsFromClusters(); // Lista contendo pontos do centroid depois da atualização

            // Verifica se os pontos atribuídos aos clusters não mudaram
            estaAtualizado = this.checkConvergence(pA, pN);
        }
    }

    vinculaPontosAoCentroid() {
        for (const point of this.points) {

            // Seleciona o centroid mais próximo ao ponto
            const centroidMaisProximo = this.clusters.reduce((closest, cluster) => {
                const distance = cluster.distanciaParaCentroid(point);
                return distance < closest.distance ? { cluster, distance } : closest;
            }, { cluster: null, distance: Infinity }).cluster;

            // Atribui o ponto ao centroide mais próximo
            centroidMaisProximo.addPonto(point);
        }
    }

    attCentroid() {
        for (const cluster of this.clusters) {
            cluster.atualizaCentro();  // Atualiza a posição dos centroides
        }
    }

    limpaCentroids() {
        for (const cluster of this.clusters) {
            cluster.limpaPontos();  // Limpa os pontos dos clusters
        }
    }

    addPonto(x, y) {
        this.points.push(new Point(x, y));  // Adiciona um ponto à lista de pontos
    }

    selecionarCentroidAleatorio() {
        // Seleciona aleatoriamente pontos para clusters terem como coordenada inicial
        const centroidAleatorio = this.points.sort(() => 0.5 - Math.random()).slice(0, this.k);
        this.clusters = centroidAleatorio.map((center, i) => new Cluster(i, center));
    }

    getPointsFromClusters() {
        return this.clusters.map(cluster => cluster.listaPontos());  // Retorna os pontos de cada cluster como strings
    }

    checkConvergence(pA, pN) {
        if (pA.length !== pN.length) {
            return false;  // Verifica se o número de clusters mudou
        }
        for (let i = 0; i < pA.length; i++) {
            if (pA[i].length !== pN[i].length || pA[i].some((point, idx) => point !== pN[i][idx])) {
                return false;  // Verifica se os pontos atribuídos aos clusters mudaram
            }
        }
        return true;  // Retorna verdadeiro se os pontos não mudaram
    }
}

// Instanciando o algoritmo K-means com 2 centroides
const k_means = new KMeans(2);

// Adicionando pontos
k_means.addPonto(1, 1);
k_means.addPonto(9.4, 6.4);
k_means.addPonto(2.5, 2.1);
k_means.addPonto(8, 7.7);
k_means.addPonto(0.5, 2.2);
k_means.addPonto(7.9, 8.4);
k_means.addPonto(7, 7);
k_means.addPonto(2.8, 0.8);
k_means.addPonto(1.2, 3);
k_means.addPonto(7.8, 6.1);

// Executando o algoritmo K-means
k_means.run();
