// 1 - Escolhe aleatoriamente dois pontos iniciais para serem os centróides

// 2 - Calcula a distância geométrica entre cada ponto da base até cada centroide

// 3 - Associa cada ponto ao centroide mais perto

// 4 - Se não houve mudança no conjunto dos centroides, então o Kmeans finalizou

// 5 - Se houve mudança no conjunto dos centroides

// 5.1 - Calcula a média das coordendas X do conjunto CJ1
// 5.2 - Calcula a média das coordendas Y do conjunto CJ1
// 5.3 - Faça o novo centroide C1 ser os valores das médias de 5.1 e 5.2

// 5.4 - Calcula a média das coordendas X do conjunto CJ2
// 5.5 - Calcula a média das coordendas Y do conjunto CJ2
// 5.6 - Faça o novo centroide 21 ser os valores das médias de 5.4 e 5.5

// 6 - Volta para o passo 2


// Classe que representa um ponto
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

// Classe que representa um cluster
class Cluster {
    constructor(id, center) {
        this.id = id;
        this.center = center;  // Centroide
        this.points = [];  // Lista de pontos pertencentes ao cluster
    }

    // Limpa a lista de pontos do cluster
    limpaPontos() {
        this.points = [];
    }

    // Adiciona um ponto ao cluster
    addPonto(point) {
        this.points.push(point);
    }

    // Calcula a distância euclidiana do ponto para o centroide do cluster usando a fórmula
    distanciaParaCentroide(point) {
        const dx = this.center.x - point.x;
        const dy = this.center.y - point.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    // Atualiza a posição do centroide com as médias das coordenadas X e Y dos pontos do cluster
    // É responsável por recalcular a posição do centroide de um cluster com base na média das coordenadas
    // dos pontos atribuídos a esse cluster
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

            // Atualiza a posição do centroide para a nova posição calculada
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
        // 1 - Escolhe aleatoriamente dois pontos iniciais para serem os centróides
        this.selecionarCentroideAleatorio();

        let atualizado = false;  // Variável para verificar se houve convergência

        while (!atualizado) {
            const c1 = this.getPointsFromClusters(); // Lista contendo pontos do centroide antes da atualização
            this.limpaCentroids(); // Limpa os pontos que pertencem ao centroide

            this.vinculaPontosAoCentroid(); // Vincula pontos ao cluster mais próximo
            this.attCentroid();  // Atualiza a posição dos centroides

            const c2 = this.getPointsFromClusters(); // Lista contendo pontos do centroide depois da atualização

            // Verifica se os pontos atribuídos aos clusters não mudaram, se não o Kmeans finalizou
            atualizado = this.verificarConvergencia(c1, c2);
        }
        // 4 - Se não houve mudança no conjunto dos centroides, então o Kmeans finalizou

    }

    vinculaPontosAoCentroid() {
        for (const point of this.points) {
            // 2 - Calcula a distância geométrica entre cada ponto da base até cada centroide
            // 3 - Associa cada ponto ao centroide mais perto

            const centroidMaisProximo = this.clusters.reduce((closest, cluster) => {
                const distance = cluster.distanciaParaCentroide(point);
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

    selecionarCentroideAleatorio() {
        // Seleciona aleatoriamente pontos para clusters terem como coordenada inicial
        const centroidAleatorio = this.points.sort(() => 0.5 - Math.random()).slice(0, this.k);
        this.clusters = centroidAleatorio.map((center, i) => new Cluster(i, center)); // Cria um novo cluster com identificador i e centroide center
    }

    getPointsFromClusters() {
        return this.clusters.map(cluster => cluster.listaPontos());
    }

    verificarConvergencia(c1, c2) {
        if (pA.length !== pN.length) {
            return false;  // Verifica se o número de clusters mudou
        }
        for (let i = 0; i < pA.length; i++) {
            if (pA[i].length !== pN[i].length || pA[i].some((point, idx) => point !== pN[i][idx])) {
                return false;  // Verifica se os pontos atribuídos aos clusters mudaram
            }
        }
        return true;  // Retorna verdadeiro se os pontos não mudaram
        // 4 - Se não houve mudança no conjunto dos centroides, então o Kmeans finalizou

    }
}

// Instanciando o algoritmo K-means com 2 centroides
const k_means = new KMeans(2);

// Adicionando pontos, os mesmo do exemplo
k_means.addPonto(0.5, 2.2);
k_means.addPonto(1.2, 3);
k_means.addPonto(1, 1);
k_means.addPonto(2.5, 2.1);
k_means.addPonto(2.8, 0.8);
k_means.addPonto(7, 7);
k_means.addPonto(7.8, 6.1);
k_means.addPonto(7.9, 8.4);
k_means.addPonto(8, 7.7);
k_means.addPonto(9.4, 6.4);


k_means.run();
