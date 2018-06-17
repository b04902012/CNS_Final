import requests
import random
import string
from bs4 import BeautifulSoup as bs

words = []
counts = dict()
with open('chinese_dict.txt', 'r') as fin:
    for line in fin:
        if line[0] in string.ascii_letters:
            continue
        word = line.strip().split()[0]
        count = int(line.strip().split()[1])

        words.append(word)
        counts[word] = count
words = sorted(words, key=lambda x: -counts[x])


def random_string(length):
    return ''.join(random.choice(string.ascii_letters + string.digits) for i in range(length))

def gen_random_url(base_url, url_num=500, token_len=5):
    for i in range(url_num):
        url = base_url + random_string(token_len)
        yield url

def gen_chinese_url(base_url="http://bit.ly/", url_num=500):
    word_list = words[:url_num]
    print("Minimum counts:", counts[words[url_num-1]])

    for word in word_list:
        url = base_url + word
        yield url




if __name__ == '__main__':

    url_num = 100
    valid_url = 0

    for i, url in enumerate(gen_random_url(base_url="http://goo.gl/", url_num=url_num)):
        origin_url = ""
        r = requests.get(url, allow_redirects=False)
        assert(r.status_code != 403) # 403 may represent YOU ARE BANNED!!

        if r.status_code != 404:
            valid_url += 1
            soup = bs(r.text, 'html.parser')
            origin_url = soup.find('a')['href']

        print(i, r.status_code, url, origin_url)

    print("{:.2%}".format(valid_url / url_num))


