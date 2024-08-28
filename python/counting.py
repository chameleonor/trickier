from collections import Counter

def count_repeated_and_unique(data):
    # Cria uma lista de todos os _id presentes nos dicionários
    ids = [item['_id'] for item in data]

    # Conta a ocorrência de cada _id
    id_counts = Counter(ids)

    # Calcula a quantidade de _id repetidos e únicos
    repeated = sum(1 for count in id_counts.values() if count > 1)
    unique = sum(1 for count in id_counts.values() if count == 1)

    # Retorna o resultado como um dicionário
    return {'repeated': repeated, 'unique': unique}