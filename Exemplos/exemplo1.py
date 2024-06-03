import random
from typing import List

# Classe que representa um ponto no espaço bidimensional
class Point:
    def __init__(self, x, y):
        self.x = x  # Coordenada X do ponto
        self.y = y  # Coordenada Y do ponto

    def __str__(self):
        return f'({self.x}, {self.y})'  # Representação do ponto como string

# Classe que representa um cluster no K-means
class Cluster:
    def __init__(self, _id, center):
        self.id = _id  # Identificador do cluster
        self.center = center  # Centro (ou centroid) do cluster
        self.points = []  # Lista de pontos pertencentes ao cluster

    def limpaPontos(self):
        self.points.clear()  # Limpa a lista de pontos do cluster

    def addPonto(self, point):
        self.points.append(point)  # Adiciona um ponto ao cluster

    def listaPontos(self):
        return [str(ponto) for ponto in self.points]  # Lista os pontos do cluster como strings
    
    def exibirCentroid(self):
        centroid = "Centroid {}: {}".format(self.id, self.center)
        print(centroid)  # Exibe o centroide do cluster
    
    # Calcula a distância euclidiana do ponto para o centroide do cluster
    def distanciaParaCentroid(self, point):
        dx = self.center.x - point.x
        dy = self.center.y - point.y
        return (dx ** 2 + dy ** 2) ** 0.5

    # Atualiza a posição do centroide com as médias das coordenadas X e Y dos pontos do cluster
    def atualizaCentro(self):
        sum_x = sum_y = 0

        for point in self.points:
            sum_x += point.x
            sum_y += point.y

        num_points = len(self.points)
        if num_points > 0:
            new_center_x = sum_x / num_points
            new_center_y = sum_y / num_points
            self.center = Point(new_center_x, new_center_y)

    def __str__(self):
        return f'Centroid {self.id} \nCentro: {self.center}\nPontos: {", ".join(map(str, self.points))}\n'

# Classe que implementa o algoritmo K-means
class KMeans:
    def __init__(self, qtdCentroids):
        self.k = qtdCentroids  # Número de clusters
        self.points = []  # Lista de todos os pontos
        self.clusters = []  # Lista de clusters

    def run(self):
        self.selecionarCentroidAleatorio()  # Seleciona centroides iniciais aleatórios
        estaAtualizado = False
        rodada = 1
        while not estaAtualizado:
            print("------- Rodada {} --------".format(rodada))
            self.showCentroid()  # Mostra os centroides atuais
            # Lista contendo Pontos do Centroid antes da atualização
            pA = self.getPointsFromClusters()
            # Limpa os pontos que pertencem ao Centroid
            self.limpaCentroids()
            # Vincula Pontos ao Cluster mais próximo
            self.vinculaPontosAoCentroid()
            # Lista contendo Pontos do Centroid depois da atualização
            pN = self.getPointsFromClusters()
            print(pA)
            print(pN)

            # Verifica se os pontos atribuídos aos clusters não mudaram
            if (pA[0] == pN[0]) or (pA[0] == pN[1]):
                if (pA[1] == pN[0]) or (pA[1] == pN[1]):
                    estaAtualizado = True
                else:
                    estaAtualizado = False

            print('-------------------------')
            print('                              ')
            # Recalcula posição do Cluster
            self.attCentroid() 
            rodada += 1

        self.mostraCentroids()  # Mostra os clusters finais

    def vinculaPontosAoCentroid(self):
        for point in self.points:
            # Seleciona o centroid mais próximo ao ponto
            centroidMaisProximo = min(self.clusters, key=lambda cluster: cluster.distanciaParaCentroid(point))
            # Atribui o ponto ao centroid mais próximo
            centroidMaisProximo.addPonto(point)

    def attCentroid(self):
        for cluster in self.clusters:
            cluster.atualizaCentro()  # Atualiza a posição dos centroides

    def limpaCentroids(self):
        for cluster in self.clusters:
            cluster.limpaPontos()  # Limpa os pontos dos clusters

    def showCentroid(self):
        for cluster in self.clusters:
            cluster.exibirCentroid()  # Exibe os centroides atuais

    def mostraCentroids(self):
        for cluster in self.clusters:
            print(cluster)  # Mostra os clusters finais

    def getPoints(self):
        for cluster in self.clusters:
            cluster.listaPontos()  # Lista os pontos de cada cluster

    def addPonto(self, x, y):
        self.points.append(Point(x, y))  # Adiciona um ponto à lista de pontos

    def selecionarCentroidAleatorio(self):
        # Seleciona aleatoriamente pontos para clusters terem como coordenada inicial
        centroidAleatorio = random.sample(self.points, self.k)
        self.clusters = [Cluster(i, center) for i, center in enumerate(centroidAleatorio)]
    
    def getPointsFromClusters(self):
        all_points = []
        for cluster in self.clusters:
            points_of_cluster = cluster.listaPontos()
            all_points.append(points_of_cluster)
        return all_points

# Instanciando o algoritmo K-means com 2 centroides
k_means = KMeans(qtdCentroids = 2)

# Adicionando pontos
k_means.addPonto(1, 1)
k_means.addPonto(9.4, 6.4)
k_means.addPonto(2.5, 2.1)
k_means.addPonto(8, 7.7)
k_means.addPonto(0.5, 2.2)
k_means.addPonto(7.9, 8.4)
k_means.addPonto(7, 7)
k_means.addPonto(2.8, 0.8)
k_means.addPonto(1.2, 3)
k_means.addPonto(7.8, 6.1)

# Executando o algoritmo K-means
k_means.run()
