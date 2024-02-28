from elasticsearch import Elasticsearch

def contar_registros_por_data_e_filtros(host, index_name, start_date, end_date, old_stats, revision):
    """
    Conta os registros em um índice do Elasticsearch baseado em um intervalo de datas e filtros específicos.

    Parâmetros:
    - host: URL do servidor Elasticsearch.
    - index_name: Nome do índice a ser pesquisado.
    - start_date: Data de início do intervalo (inclusive), no formato "YYYY-MM-DD".
    - end_date: Data de fim do intervalo (exclusive), no formato "YYYY-MM-DD".
    - old_stats: Valor booleano para filtrar pelo campo "old_stats".
    - revision: Valor da string para filtrar pelo campo "revision".
    
    Retorna:
    - Quantidade de registros que correspondem aos critérios.
    """
    # Conecta ao Elasticsearch
    es = Elasticsearch(host)

    # Monta a query
    query = {
      "query": {
        "bool": {
          "must": [
            {
              "range": {
                "@timestamp": {
                  "gte": f"{start_date}T00:00:00Z",
                  "lt": f"{end_date}T00:00:00Z"
                }
              }
            },
            {
              "match": {
                "old_stats": old_stats
              }
            },
            {
              "match": {
                "revision": revision
              }
            }
          ]
        }
      },
      "size": 0  # Não precisamos dos documentos, apenas da contagem
    }

    # Executa a busca
    response = es.search(index=index_name, body=query)

    # Retorna a contagem total de registros encontrados
    return response['hits']['total']['value']

# Exemplo de uso
host = "http://localhost:9200"  # Substitua pela URL do seu servidor Elasticsearch
index_name = "seu_indice_aqui"  # Substitua pelo nome do seu índice
start_date = "2024-08-01"
end_date = "2024-08-31"
old_stats = True
revision = "v3"

# Chama a função
quantidade = contar_registros_por_data_e_filtros(host, index_name, start_date, end_date, old_stats, revision)
print(f"Quantidade de registros encontrados: {quantidade}")
