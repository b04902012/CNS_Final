# CNS Project Final
## Handso.me, An Implementation of Secure Short URL Service.
Handso.me is a secure short URL service. It is robust against database leakage, brute force attak and dicionary attack.

### Usage
Linux:
```
git clone https://github.com/b04902012/CNS_Final
cd CNS_Final
sudo systemctl start mongodb
sudo node server.js
```

### Config

You can modify some constants in ```config.js```.

\(N\) : Number of iterations for key stretching.

\(L\) : Length of short URL token.
