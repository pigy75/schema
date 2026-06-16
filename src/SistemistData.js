export const modules = [
  { id: 'networking', label: 'Networking Base', area: 'core', week: 1, icon: '🌐',
    desc: 'IP, subnet, VLAN, NAT, DNS, DHCP' },
  { id: 'switch', label: 'Switch', area: 'core', week: 2, icon: '🔌',
    desc: 'Aruba 1930 + Alcatel AOS 6' },
  { id: 'firewall', label: 'Firewall', area: 'core', week: 3, icon: '🔥',
    desc: 'Sophos XGS — zone, regole, NAT, VPN' },
  { id: 'windows', label: 'Windows & PS', area: 'core', week: 4, icon: '💻',
    desc: 'Troubleshooting + PowerShell base' },
  { id: 'ad', label: 'Active Directory', area: 'core', week: 5, icon: '🏢',
    desc: 'Utenti, GPO, OU, join dominio' },
  { id: 'm365', label: 'Microsoft 365', area: 'core', week: 6, icon: '☁️',
    desc: 'Admin Center, Exchange, MFA' },
  { id: 'virtualization', label: 'Virtualizzazione', area: 'professional', week: 7, icon: '🖥️',
    desc: 'Proxmox + ESXi teoria' },
  { id: 'storage', label: 'Storage & NAS', area: 'professional', week: 8, icon: '💾',
    desc: 'NAS, RAID, regola 3-2-1' },
  { id: 'backup', label: 'Backup', area: 'professional', week: 8, icon: '🔄',
    desc: 'PBS, Veeam, restore test' },
  { id: 'monitoring', label: 'Monitoraggio', area: 'professional', week: 9, icon: '📊',
    desc: 'Zabbix, SNMP, alert' },
  { id: 'syslog', label: 'Syslog', area: 'professional', week: 9, icon: '📜',
    desc: 'rsyslog, Graylog, centralizzazione' },
  { id: 'gdpr', label: 'GDPR', area: 'compliance', week: 10, icon: '🔐',
    desc: 'Privacy, BitLocker, accessi' },
  { id: 'nis2', label: 'NIS2', area: 'compliance', week: 10, icon: '🛡️',
    desc: 'Sicurezza operativa, incident response' },
];

export const STATUS = { todo: 'Da iniziare', doing: 'In corso', done: 'Completato' };
export const STATUS_COLORS = {
  todo: { bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b', dot: '#94a3b8' },
  doing: { bg: '#fef3c7', border: '#fbbf24', text: '#92400e', dot: '#f59e0b' },
  done: { bg: '#dcfce7', border: '#4ade80', text: '#166534', dot: '#22c55e' },
};
export const AREA_COLORS = {
  core: { bg: '#dbeafe', border: '#3b82f6', label: 'Core Tecnico', text: '#1e40af' },
  professional: { bg: '#e0e7ff', border: '#6366f1', label: 'Professional', text: '#3730a3' },
  compliance: { bg: '#fce7f3', border: '#ec4899', label: 'Compliance', text: '#9d174d' },
};

export const referenceCards = {
  networking: {
    title: 'Networking Base',
    icon: '🌐',
    sections: [
      {
        title: 'Concetti Fondamentali',
        rows: [
          { concept: 'IP Address', definition: 'Indirizzo univoco di un host su rete IP', example: '192.168.1.10', note: 'IPv4: 4 ottetti separati da punto' },
          { concept: 'Subnet /24', definition: 'Maschera di rete che divide host e rete', example: '255.255.255.0 → 254 host', note: 'Impara anche /16 e /8' },
          { concept: 'Default Gateway', definition: 'Router che instrada il traffico fuori dalla subnet', example: '192.168.1.1', note: 'Senza GW non esci dalla LAN' },
          { concept: 'DNS', definition: 'Risolve nomi in indirizzi IP', example: 'nslookup google.com', note: 'Il 90% dei problemi di rete è DNS' },
          { concept: 'DHCP', definition: 'Assegna IP automaticamente ai client', example: 'Lease: IP + GW + DNS + mask', note: 'Statico per server, DHCP per client' },
          { concept: 'NAT', definition: 'Traduce IP privati in IP pubblico per uscire su Internet', example: '192.168.1.x → 1.2.3.4 (WAN)', note: 'PAT = NAT con porte (più comune)' },
        ]
      },
      {
        title: 'VLAN',
        rows: [
          { concept: 'VLAN', definition: 'Segmentazione logica della rete su switch fisici', example: 'VLAN 10=LAN, 20=Server, 30=Guest', note: 'Isola il traffico senza cavi separati' },
          { concept: 'Access port', definition: 'Porta che appartiene a una sola VLAN (untagged)', example: 'PC client → porta untagged VLAN 10', note: 'Il device non sa di essere in una VLAN' },
          { concept: 'Trunk port', definition: 'Porta che trasporta più VLAN con tag 802.1Q', example: 'Switch → firewall: tagged 10,20,30', note: 'Header 802.1Q aggiunge 4 byte al frame' },
          { concept: 'Native VLAN', definition: 'VLAN non taggata su trunk (default VLAN 1)', example: 'Attenzione: mismatch causa loop', note: 'Allinea sempre native VLAN tra switch' },
        ]
      },
      {
        title: 'Troubleshooting',
        rows: [
          { concept: 'ping', definition: 'Test ICMP base — il device risponde?', example: 'ping 8.8.8.8', note: 'Se fallisce: check IP, GW, firewall' },
          { concept: 'tracert', definition: 'Traccia il percorso hop-by-hop', example: 'tracert 8.8.8.8', note: 'Identifica dove si rompe il routing' },
          { concept: 'nslookup', definition: 'Risoluzione DNS manuale', example: 'nslookup server.azienda.local', note: 'Specifica DNS: nslookup host 8.8.8.8' },
          { concept: 'ipconfig /all', definition: 'Stato completo interfacce Windows', example: 'IP, mask, GW, DNS, lease DHCP', note: '/flushdns per pulire cache DNS' },
        ]
      }
    ]
  },

  switch: {
    title: 'Switch — Aruba/Alcatel',
    icon: '🔌',
    sections: [
      {
        title: 'Aruba HP 1930',
        rows: [
          { concept: 'Accesso web UI', definition: 'Interfaccia grafica browser-based', example: 'http://192.168.1.1 (default)', note: 'Default: admin/admin — cambiare subito' },
          { concept: 'Crea VLAN', definition: 'VLAN → Add → assegna ID e nome', example: 'VLAN 10 "LAN_UTENTI"', note: 'ID VLAN max: 4094' },
          { concept: 'Porta Access', definition: 'Assegna porta a VLAN come untagged', example: 'Port 1-8 → VLAN 10 untagged', note: 'Client standard: sempre access' },
          { concept: 'Porta Trunk', definition: 'Abilita più VLAN su una porta', example: 'Port 24 → VLAN 10,20,30 tagged', note: 'Verso switch o firewall' },
          { concept: 'Save config', definition: 'Salva configurazione in flash', example: 'Maintenance → Save Config', note: 'Obbligatorio prima di riavviare' },
        ]
      },
      {
        title: 'Alcatel AOS 6 (CLI)',
        rows: [
          { concept: 'Accesso SSH', definition: 'Connessione CLI sicura', example: 'ssh admin@192.168.1.254', note: 'Console: porta seriale fallback' },
          { concept: 'show vlan', definition: 'Lista VLAN configurate', example: 'show vlan', note: 'AOS 6: no pipe/grep — usa last N' },
          { concept: 'vlan 10', definition: 'Crea VLAN', example: 'vlan 10 name "UTENTI"', note: 'Admin: vlan 1 non eliminare mai' },
          { concept: 'vlan port', definition: 'Assegna porta a VLAN', example: 'vlan 10 port default 1/1-8', note: 'default = untagged' },
          { concept: 'write memory', definition: 'Salva configurazione', example: 'write memory', note: 'Senza questo si perde al reboot' },
          { concept: 'show interfaces', definition: 'Stato porte (up/down, speed)', example: 'show interfaces port 1/1', note: 'Utile per troubleshooting fisico' },
        ]
      },
      {
        title: 'Concetti Comuni',
        rows: [
          { concept: 'STP/RSTP', definition: 'Spanning Tree: previene loop in rete con ridondanza', example: 'Root bridge eletto per priorità (default 32768)', note: 'RSTP converge in ~6s vs 30-50s STP' },
          { concept: 'LACP', definition: 'Link Aggregation: unisce più porte fisiche', example: '2x1GbE → 2Gbps aggregato', note: 'Entrambi gli switch devono supportarlo' },
          { concept: 'Port mirroring', definition: 'Copia traffico di una porta su altra porta', example: 'Mirror port 1 → port 24 (analisi)', note: 'Utile con Wireshark per troubleshooting' },
        ]
      }
    ]
  },

  firewall: {
    title: 'Firewall — Sophos XGS',
    icon: '🔥',
    sections: [
      {
        title: 'Concetti Zone',
        rows: [
          { concept: 'Zone LAN', definition: 'Rete interna — massima fiducia', example: '192.168.1.0/24', note: 'Mai aprire tutto da LAN a WAN senza regole' },
          { concept: 'Zone WAN', definition: 'Internet — zero fiducia', example: 'IP pubblico ISP', note: 'Default: blocca tutto in ingresso' },
          { concept: 'Zone DMZ', definition: 'Rete semi-pubblica per server esposti', example: 'Web server, mail server', note: 'Isolata da LAN — se compromessa, LAN protetta' },
          { concept: 'Zone VPN', definition: 'Rete utenti remoti connessi via VPN', definition: 'Utenti che si connettono da remoto', example: 'SSL VPN pool: 10.0.0.0/24', note: 'Tratta come LAN ma monitora' },
        ]
      },
      {
        title: 'Regole Firewall',
        rows: [
          { concept: 'Source', definition: 'Chi genera il traffico', example: 'Zone LAN / Network 192.168.1.0/24', note: 'Più specifico = più sicuro' },
          { concept: 'Destination', definition: 'Destinazione del traffico', example: 'Any (WAN) / IP specifico', note: 'Evita Any su regole critiche' },
          { concept: 'Service', definition: 'Protocollo e porta', example: 'HTTPS = TCP 443, RDP = TCP 3389', note: 'Crea service custom se non esiste' },
          { concept: 'Action', definition: 'Accept / Drop / Reject', example: 'Accept con log attivo', note: 'SEMPRE attiva log su regole critiche' },
          { concept: 'Ordine regole', definition: 'Le regole si applicano dall\'alto in basso', example: 'Prima regola = più specifica', note: 'Una regola Allow-All blocca quelle sotto' },
        ]
      },
      {
        title: 'NAT & VPN',
        rows: [
          { concept: 'Masquerade NAT', definition: 'IP privati → IP pubblico (SNAT)', example: 'LAN → WAN: auto masquerade', note: 'Sempre abilitato per uscita Internet' },
          { concept: 'Port forwarding', definition: 'Esponi servizio interno su porta pubblica (DNAT)', example: 'WAN:443 → 192.168.1.10:443', note: 'Usare porte non standard quando possibile' },
          { concept: 'SSL VPN', definition: 'VPN per utenti remoti via browser/client', example: 'Sophos Connect client', note: 'Split tunnel: solo traffico aziendale via VPN' },
          { concept: 'IPsec S2S', definition: 'VPN site-to-site tra due firewall', example: 'Sede A ↔ Sede B tunnel', note: 'Usare IKEv2 + AES-256' },
        ]
      }
    ]
  },

  ad: {
    title: 'Active Directory',
    icon: '🏢',
    sections: [
      {
        title: 'Struttura AD',
        rows: [
          { concept: 'Domain', definition: 'Contenitore principale — tutti i PC e utenti', example: 'azienda.local', note: 'Evita .local in ambienti con Bonjour/mDNS' },
          { concept: 'Domain Controller', definition: 'Server che autentica utenti e applica policy', example: 'WIN-DC01.azienda.local', note: 'Sempre 2 DC per ridondanza' },
          { concept: 'OU', definition: 'Organizational Unit: cartella logica per oggetti AD', example: 'OU=Utenti,OU=Ufficio,DC=azienda,DC=local', note: 'Struttura GPO → mai flat' },
          { concept: 'Forest / Tree', definition: 'Forest = dominio root + trust. Tree = domini collegati', example: 'azienda.local → filiale.azienda.local', note: 'PMI: solitamente 1 forest, 1 domain' },
          { concept: 'FSMO Roles', definition: '5 ruoli speciali del DC (PDC, RID, Schema…)', example: 'netdom query fsmo', note: 'Non toccare senza sapere cosa fai' },
        ]
      },
      {
        title: 'Gestione Utenti',
        rows: [
          { concept: 'New-ADUser', definition: 'Crea utente da PowerShell', example: "New-ADUser -Name 'Mario Rossi' -SamAccountName 'mrossi' -Enabled $true", note: 'Aggiungi -AccountPassword per impostare subito' },
          { concept: 'Set-ADUser', definition: 'Modifica attributi utente', example: "Set-ADUser mrossi -Title 'Impiegato'", note: 'Usa -Replace per attributi multipli' },
          { concept: 'Disable-ADAccount', definition: 'Disabilita account senza eliminare', example: 'Disable-ADAccount -Identity mrossi', note: 'Preferibile all\'eliminazione — mantieni storico' },
          { concept: 'Reset password', definition: 'Reset da ADUC o PS', example: "Set-ADAccountPassword -Identity mrossi -Reset", note: 'Aggiungi -ChangePasswordAtLogon $true' },
          { concept: 'Join dominio', definition: 'Aggiunge PC al dominio', example: 'Add-Computer -DomainName azienda.local', note: 'DNS deve puntare al DC — causa #1 di errori' },
        ]
      },
      {
        title: 'GPO',
        rows: [
          { concept: 'GPO', definition: 'Group Policy Object: configurazioni applicate a OU', example: 'GPMC → Create GPO → Link to OU', note: 'Sempre testare su OU di test prima' },
          { concept: 'gpupdate /force', definition: 'Forza applicazione immediata GPO', example: 'gpupdate /force && gpresult /r', note: 'Alcuni settings richiedono logoff/reboot' },
          { concept: 'gpresult /r', definition: 'Mostra GPO applicate sull\'utente/computer', example: 'gpresult /r /scope user', note: 'Usa /h report.html per report visuale' },
          { concept: 'Drive mapping GPO', definition: 'Mappa drive di rete via policy', example: 'User Config → Preferences → Drive Maps', note: 'Item-level targeting per gruppo/OU' },
          { concept: 'BitLocker GPO', definition: 'Abilita cifratura disco via policy', example: 'Computer Config → Windows Settings → BitLocker', note: 'Salva recovery key in AD obbligatoriamente' },
        ]
      }
    ]
  },

  m365: {
    title: 'Microsoft 365',
    icon: '☁️',
    sections: [
      {
        title: 'Admin Center',
        rows: [
          { concept: 'Crea utente', definition: 'Aggiunge account M365 con mailbox', example: 'admin.microsoft.com → Users → Add user', note: 'Assegna licenza subito — senza licenza no mailbox' },
          { concept: 'Assegna licenza', definition: 'Abilita prodotti M365 all\'utente', example: 'Microsoft 365 Business Basic/Standard/Premium', note: 'Licenze consumano quota — monitorare' },
          { concept: 'Reset MFA', definition: 'Resetta metodo MFA utente bloccato', example: 'Users → utente → Authentication methods → Delete', note: 'Verifica identità prima del reset' },
          { concept: 'Ruoli admin', definition: 'Permessi specifici nel tenant M365', example: 'Global Admin / User Admin / Helpdesk Admin', note: 'Principio minimo privilegio — no Global Admin a tutti' },
        ]
      },
      {
        title: 'Exchange Online',
        rows: [
          { concept: 'Shared mailbox', definition: 'Mailbox condivisa senza licenza dedicata', example: 'info@azienda.it → accesso da più utenti', note: 'Fino a 50GB gratis — oltre serve licenza' },
          { concept: 'Distribution group', definition: 'Lista di distribuzione email', example: 'tutti@azienda.it → 50 destinatari', note: 'Usa M365 Group per avere anche Teams/SharePoint' },
          { concept: 'Alias email', definition: 'Indirizzo aggiuntivo su stessa mailbox', example: 'mario@azienda.it + m.rossi@azienda.it', note: 'Massimo 400 alias per mailbox' },
          { concept: 'Auto-reply', definition: 'Risposta automatica (fuori ufficio)', example: 'EAC → Mailboxes → Automatic replies', note: 'Puoi impostare per conto dell\'utente come admin' },
        ]
      },
      {
        title: 'Sicurezza M365',
        rows: [
          { concept: 'MFA', definition: 'Multi-Factor Authentication — secondo fattore di autenticazione', example: 'Authenticator app / SMS / FIDO2', note: 'Riduce del 99.9% il rischio di account takeover' },
          { concept: 'Conditional Access', definition: 'Regole di accesso basate su condizioni', example: 'Solo da IP aziendali / solo dispositivi compliant', note: 'Richiede P1/P2 — non disponibile su Basic' },
          { concept: 'Audit log', definition: 'Log di tutte le attività nel tenant', example: 'Compliance center → Audit → Search', note: 'Conservazione: 90gg Basic, 1 anno E3' },
          { concept: 'Secure Score', definition: 'Punteggio sicurezza del tenant con consigli', example: 'security.microsoft.com → Secure Score', note: 'Punto di partenza per hardening M365' },
        ]
      }
    ]
  },

  backup: {
    title: 'Backup',
    icon: '🔄',
    sections: [
      {
        title: 'Regole Fondamentali',
        rows: [
          { concept: 'Regola 3-2-1', definition: '3 copie, 2 media diversi, 1 offsite', example: 'Dati → NAS locale + NAS sede2 + Cloud', note: 'Standard minimo per qualsiasi azienda' },
          { concept: 'RTO', definition: 'Recovery Time Objective: in quanto tempo devi tornare operativo', example: 'RTO = 4h → entro 4h dal disastro', note: 'Definire con il cliente PRIMA del disastro' },
          { concept: 'RPO', definition: 'Recovery Point Objective: quanti dati puoi perdere', example: 'RPO = 24h → perdi al max 1 giorno di dati', note: 'Determina la frequenza dei backup' },
          { concept: 'Retention', definition: 'Per quanto tempo conservare i backup', example: 'Daily: 7gg, Weekly: 4, Monthly: 12', note: 'GDPR: non conservare più del necessario' },
          { concept: 'Test restore', definition: 'Verifica periodica che il backup sia ripristinabile', example: 'Mensile: restore file random + verifica integrità', note: 'Un backup non testato NON esiste' },
        ]
      },
      {
        title: 'Proxmox Backup Server (PBS)',
        rows: [
          { concept: 'Datastore', definition: 'Repository dove vengono salvati i backup', example: '/mnt/datastore/backup-client1', note: 'Usa ZFS o LVM per deduplication' },
          { concept: 'Backup job', definition: 'Schedulazione backup VM/CT da Proxmox', example: 'Daily 02:00 → VM 100,101,102 → PBS', note: 'Modalità: Snapshot (online) / Stop / Suspend' },
          { concept: 'Deduplication', definition: 'PBS non salva blocchi già esistenti', example: 'VM 50GB → backup incrementale 2GB', note: 'Risparmio spazio enorme su backup frequenti' },
          { concept: 'Restore VM', definition: 'Ripristino VM da backup PBS', example: 'Proxmox → Backup → Restore', note: 'Testa su VM separata — non sovrascrivere produzione' },
        ]
      },
      {
        title: 'Veeam (Teoria)',
        rows: [
          { concept: 'Backup job', definition: 'Job che salva VM VMware/Hyper-V', example: 'Schedule + Source VM + Repository + Retention', note: 'Application-aware: backup consistente DB/Exchange' },
          { concept: 'Repository', definition: 'Destinazione dei backup (disk/NAS/tape/cloud)', example: 'NAS SMB / Object Storage S3', note: 'Immutable: repository che non si può modificare/cancellare' },
          { concept: 'Instant Recovery', definition: 'Avvia VM direttamente dal backup', example: 'VM online in <2 min anche da backup completo', note: 'Ottimo per disaster recovery rapido' },
          { concept: 'File-level restore', definition: 'Ripristina singoli file da backup VM', example: 'Veeam Explorer → seleziona file', note: 'Senza bisogno di restore completo VM' },
        ]
      }
    ]
  },

  monitoring: {
    title: 'Monitoraggio — Zabbix',
    icon: '📊',
    sections: [
      {
        title: 'Concetti Base',
        rows: [
          { concept: 'Host', definition: 'Device monitorato (server, switch, firewall)', example: 'SRV-AD01 → IP 192.168.1.10', note: 'Aggiungi con IP + template + group' },
          { concept: 'Template', definition: 'Set predefinito di item/trigger/graph', example: 'Template OS Windows / Template Net Cisco', note: 'Non inventare da zero — usa template community' },
          { concept: 'Item', definition: 'Metrica raccolta dal device', example: 'CPU utilization, Free disk space', note: 'Key: system.cpu.util / vfs.fs.size[/,pfree]' },
          { concept: 'Trigger', definition: 'Condizione che genera un problema/alert', example: 'CPU > 90% per 5min → PROBLEM', note: 'Severity: Info / Warning / Average / High / Disaster' },
          { concept: 'Alert', definition: 'Notifica inviata quando si attiva un trigger', example: 'Email / Telegram / Teams webhook', note: 'Configura escalation: 15min → secondo livello' },
        ]
      },
      {
        title: 'SNMP',
        rows: [
          { concept: 'SNMP v2c', definition: 'Protocollo monitoraggio device di rete', example: 'Community string "public" (cambiare!)', note: 'In chiaro — usare v3 su reti non fidate' },
          { concept: 'OID', definition: 'Identificatore univoco di ogni metrica SNMP', example: '1.3.6.1.2.1.1.3.0 = sysUpTime', note: 'MIB browser per scoprire OID disponibili' },
          { concept: 'snmpwalk', definition: 'Elenca tutti gli OID disponibili su un device', example: 'snmpwalk -v2c -c public 192.168.1.254', note: 'Installa: apt install snmp snmp-mibs-downloader' },
          { concept: 'SNMP trap', definition: 'Notifica push dal device a Zabbix (inverso al polling)', example: 'Switch porta giù → trap a Zabbix', note: 'Più veloce del polling ma richiede config sul device' },
        ]
      },
      {
        title: 'Cosa Monitorare',
        rows: [
          { concept: 'Server Windows', definition: 'CPU, RAM, disco, servizi critici, event log', example: 'Template: Windows by Zabbix agent', note: 'Installa Zabbix Agent 2 su ogni server' },
          { concept: 'Switch', definition: 'Porte up/down, traffico, errori, CPU, uptime', example: 'Template: Generic SNMP', note: 'Porta giù = alert immediato' },
          { concept: 'Firewall Sophos', definition: 'CPU, RAM, sessioni, VPN tunnel, regole hit', example: 'SNMP + Sophos API', note: 'Sophos Central ha monitoring nativo' },
          { concept: 'Backup job', definition: 'Esito backup (OK/WARNING/FAIL)', example: 'Zabbix item → log backup → trigger se FAIL', note: 'Script check + invio a Zabbix via sender' },
        ]
      }
    ]
  },

  syslog: {
    title: 'Syslog',
    icon: '📜',
    sections: [
      {
        title: 'Concetti Base',
        rows: [
          { concept: 'Severity levels', definition: 'Livelli di gravità dei log (0-7)', example: '0=Emerg, 3=Error, 5=Notice, 7=Debug', note: 'Filtra per livello: 0-4 per produzione' },
          { concept: 'Facility', definition: 'Categoria sorgente del log', example: '0=kernel, 4=auth, 16-23=local0-7', note: 'local0-7 usate da device di rete' },
          { concept: 'UDP 514', definition: 'Porta standard syslog (UDP)', example: 'Firewall apre UDP 514 verso server syslog', note: 'TCP 514 per affidabilità (no perdita pacchetti)' },
          { concept: 'rsyslog', definition: 'Server syslog standard Linux', example: 'apt install rsyslog', note: 'Config: /etc/rsyslog.conf + /etc/rsyslog.d/' },
        ]
      },
      {
        title: 'Configurazione rsyslog',
        rows: [
          { concept: 'Ricevi log UDP', definition: 'Abilita ricezione syslog in ingresso', example: '$ModLoad imudp\n$UDPServerRun 514', note: 'Aggiungi in /etc/rsyslog.conf' },
          { concept: 'Salva per IP', definition: 'Separa log per IP sorgente', example: '$template RemoteLogs,"/var/log/remote/%HOSTNAME%.log"', note: 'Un file per device — facile da cercare' },
          { concept: 'Riavvio rsyslog', definition: 'Applica configurazione', example: 'systemctl restart rsyslog', note: 'Verifica: systemctl status rsyslog' },
          { concept: 'Leggi log', definition: 'Cerca eventi specifici nei log', example: "grep 'authentication failure' /var/log/remote/firewall.log", note: 'tail -f per log in tempo reale' },
        ]
      },
      {
        title: 'Cosa Cercare nei Log',
        rows: [
          { concept: 'Login falliti', definition: 'Tentativi accesso non autorizzato', example: 'authentication failure / Invalid user', note: 'Molti tentativi = brute force in corso' },
          { concept: 'Porta giù', definition: 'Interfaccia di rete down su switch', example: 'Interface Gi0/1 changed state to down', note: 'Può indicare guasto fisico o loop' },
          { concept: 'Config changed', definition: 'Modifiche alla configurazione del device', example: 'Configured from console by admin', note: 'Chi? Quando? — audit trail' },
          { concept: 'VPN events', definition: 'Connessioni e disconnessioni VPN', example: 'SSL VPN user mario connected from 1.2.3.4', note: 'Orari anomali = investigare' },
        ]
      }
    ]
  },

  gdpr: {
    title: 'GDPR',
    icon: '🔐',
    sections: [
      {
        title: 'Concetti Chiave',
        rows: [
          { concept: 'Dato personale', definition: 'Qualsiasi info che identifica una persona', example: 'Nome, email, IP, targa auto, foto', note: 'Anche email aziendale mario.rossi@azienda.it è dato personale' },
          { concept: 'Titolare', definition: 'Chi decide come trattare i dati', example: 'Il cliente azienda (il tuo committente)', note: 'Firma il contratto con te come responsabile' },
          { concept: 'Responsabile', definition: 'Chi tratta dati per conto del titolare', example: 'Tu come consulente IT', note: 'Serve DPA (Data Processing Agreement) firmato' },
          { concept: 'Minimizzazione', definition: 'Raccogliere solo i dati strettamente necessari', example: 'Non loggare password in chiaro nei log', note: 'Principio base: less is more' },
          { concept: 'Violazione (breach)', definition: 'Accesso non autorizzato o perdita di dati', example: 'Ransomware, furto PC, email sbagliata', note: 'Notifica Garante entro 72h se rischio per persone' },
        ]
      },
      {
        title: 'Impatto Pratico per Sistemista',
        rows: [
          { concept: 'BitLocker', definition: 'Cifratura disco su PC Windows', example: 'GPO → BitLocker → salva chiave in AD', note: 'OBBLIGATORIO su PC aziendali con dati personali' },
          { concept: 'Controllo accessi', definition: 'Solo chi ha bisogno accede ai dati', example: 'No cartelle Everyone con Full Control', note: 'Principio del minimo privilegio' },
          { concept: 'Password policy', definition: 'Complessità e scadenza password', example: 'Min 12 caratteri, scadenza 90gg, lockout 5 tentativi', note: 'GPO Default Domain Policy' },
          { concept: 'Log accessi', definition: 'Traccia chi accede a cosa e quando', example: 'AD audit, firewall log, NAS access log', note: 'Conservare min 6 mesi per PMI' },
          { concept: 'Backup protetto', definition: 'I backup devono essere protetti quanto i dati', example: 'Backup cifrato + accesso ristretto', note: 'Un backup non cifrato è una violazione potenziale' },
        ]
      }
    ]
  },

  nis2: {
    title: 'NIS2',
    icon: '🛡️',
    sections: [
      {
        title: 'Cosa Cambia per il Sistemista',
        rows: [
          { concept: 'Patch management', definition: 'Aggiornamenti sistematici e documentati', example: 'WSUS per Windows, script per Linux', note: 'Documentare: cosa, quando, da chi' },
          { concept: 'MFA obbligatorio', definition: 'Autenticazione multi-fattore su accessi critici', example: 'VPN, RDP remoto, M365 admin, firewall', note: 'Senza MFA su admin: non conforme NIS2' },
          { concept: 'Segmentazione rete', definition: 'VLAN separate per tipo di traffico', example: 'VLAN utenti / server / IoT / guest', note: 'Zero Trust: non fidarsi di nessuna zona di default' },
          { concept: 'Backup testati', definition: 'Backup funzionanti con RTO/RPO definiti', example: 'Test mensile restore + documentazione', note: 'Non basta avere il backup — devi saper ripristinare' },
          { concept: 'Incident response', definition: 'Procedura documentata per gestire incidenti', example: 'Chi chiama chi, cosa fare, quando notificare', note: 'Senza procedura: sanzioni per il titolare' },
        ]
      },
      {
        title: 'Incident Response — Procedura',
        rows: [
          { concept: '1. ISOLA', definition: 'Disconnetti il sistema dalla rete', example: 'Stacca cavo LAN / disabilita NIC', note: 'NON spegnere se ransomware — perdi prove forensi' },
          { concept: '2. AVVISA', definition: 'Notifica il responsabile IT e il titolare', example: 'Chiamata + email con timestamp', note: 'Documenta ora e descrizione evento' },
          { concept: '3. DOCUMENTA', definition: 'Annota tutto quello che vedi', example: 'Screenshot errori, file cifrati, log', note: 'Fondamentale per forensics e notifica Garante' },
          { concept: '4. BACKUP CHECK', definition: 'Verifica che i backup siano integri e non compromessi', example: 'Accedi a PBS/Veeam e verifica ultimo backup OK', note: 'Se backup compromesso: escalation immediata' },
          { concept: '5. RIPRISTINA', definition: 'Restore solo dopo aver capito il vettore di attacco', example: 'Prima patch/fix vulnerabilità, poi restore', note: 'Ripristinare senza fix = reinfezione garantita' },
        ]
      }
    ]
  },

  virtualization: {
    title: 'Virtualizzazione',
    icon: '🖥️',
    sections: [
      {
        title: 'Proxmox VE',
        rows: [
          { concept: 'VM vs CT', definition: 'VM: sistema completo virtualizzato. CT: container LXC (condivide kernel)', example: 'VM: Windows Server. CT: Ubuntu web server', note: 'CT più leggero ma solo Linux' },
          { concept: 'Snapshot', definition: 'Fotografia istantanea dello stato VM', example: 'Prima di aggiornamenti critici: snapshot', note: 'NON è un backup — snapshots su stesso storage' },
          { concept: 'Bridge vmbr0', definition: 'Switch virtuale che connette VM alla rete fisica', example: 'vmbr0 → eth0 (fisica) → VM', note: 'VLAN tag: abilita tagging su bridge per VLAN multiple' },
          { concept: 'Storage', definition: 'Dove vivono i dischi VM', example: 'local-lvm (LVM-thin), NFS, Ceph', note: 'LVM-thin: snapshot efficienti, dedup' },
          { concept: 'PBS integration', definition: 'Backup VM direttamente su Proxmox Backup Server', example: 'Datacenter → Storage → Add PBS', note: 'Backup incrementali — molto più veloci del full' },
        ]
      },
      {
        title: 'VMware ESXi (Teoria)',
        rows: [
          { concept: 'Hypervisor type 1', definition: 'Gira direttamente su hardware, no OS host', example: 'ESXi installato su bare metal', note: 'Proxmox è anch\'esso type 1 (Debian sotto)' },
          { concept: 'vCenter', definition: 'Management centralizzato di più host ESXi', example: 'vCenter → gestisci 10 host da unica console', note: 'Richiede licenza — Proxmox è gratuito' },
          { concept: 'vMotion', definition: 'Migrazione VM live senza downtime tra host', example: 'VM sposta da host1 a host2 senza reboot', note: 'Proxmox equivalente: Live Migration' },
          { concept: 'VMDK', definition: 'Formato disco virtuale VMware', example: 'VM-flat.vmdk = dati, VM.vmdk = descriptor', note: 'Conversione a QCOW2 per Proxmox: qemu-img convert' },
          { concept: 'HA Cluster', definition: 'Riavvio automatico VM su altro host se host cade', example: 'Host1 muore → VM ripartono su Host2', note: 'Proxmox: HA con Corosync/Pacemaker' },
        ]
      }
    ]
  },

  windows: {
    title: 'Windows & PowerShell',
    icon: '💻',
    sections: [
      {
        title: 'Troubleshooting Network',
        rows: [
          { concept: 'ping -t', definition: 'Ping continuo — monitora connettività', example: 'ping -t 192.168.1.1', note: 'Ctrl+C per fermare, mostra statistiche' },
          { concept: 'tracert', definition: 'Traccia hop-by-hop fino a destinazione', example: 'tracert 8.8.8.8', note: '* = hop non risponde a ICMP (non sempre errore)' },
          { concept: 'nslookup', definition: 'Query DNS manuale', example: 'nslookup server.azienda.local 192.168.1.10', note: 'Specifica DNS per testare server specifico' },
          { concept: 'netstat -an', definition: 'Porte aperte e connessioni attive', example: 'netstat -an | findstr :3389', note: 'Utile per verificare servizi in ascolto' },
          { concept: 'Test-NetConnection', definition: 'Verifica raggiungibilità host+porta (PS)', example: 'Test-NetConnection 192.168.1.10 -Port 443', note: 'Sostituisce telnet su Windows moderno' },
        ]
      },
      {
        title: 'PowerShell Essenziale',
        rows: [
          { concept: 'Get-ADUser', definition: 'Recupera info utente AD', example: "Get-ADUser mrossi -Properties *", note: 'Aggiungi | Select-Object per filtrare colonne' },
          { concept: 'Get-Service', definition: 'Stato servizi Windows', example: "Get-Service | Where Status -eq 'Stopped'", note: 'Set-Service -Status Running per avviare' },
          { concept: 'Get-EventLog', definition: 'Legge event log di Windows', example: 'Get-EventLog -LogName System -Newest 20 -EntryType Error', note: 'Usa Get-WinEvent per log moderni (più veloce)' },
          { concept: 'Invoke-Command', definition: 'Esegue comandi su PC remoto', example: "Invoke-Command -ComputerName SRV01 -ScriptBlock { Get-Service }", note: 'Richiede WinRM abilitato e credenziali' },
          { concept: 'Export-Csv', definition: 'Esporta risultati in CSV', example: "Get-ADUser -Filter * | Select Name,Email | Export-Csv utenti.csv -NoTypeInformation", note: 'Utile per reportistica e audit' },
        ]
      }
    ]
  },

  storage: {
    title: 'Storage & NAS',
    icon: '💾',
    sections: [
      {
        title: 'RAID',
        rows: [
          { concept: 'RAID 0', definition: 'Striping: prestazioni max, zero ridondanza', example: '2x1TB → 2TB usabile, se 1 muore perdi tutto', note: 'Mai per dati importanti — solo performance' },
          { concept: 'RAID 1', definition: 'Mirror: copia identica su 2 dischi', example: '2x1TB → 1TB usabile, tolera 1 guasto', note: 'Semplice e affidabile — ideale per OS server' },
          { concept: 'RAID 5', definition: 'Striping con parità distribuita', example: '3x1TB → 2TB usabile, tolera 1 guasto', note: 'Min 3 dischi — buon compromesso spazio/sicurezza' },
          { concept: 'RAID 6', definition: 'Doppia parità — tolera 2 guasti contemporanei', example: '4x1TB → 2TB usabile, tolera 2 guasti', note: 'Per array grandi o dischi lenti' },
          { concept: 'RAID ≠ Backup', definition: 'RAID protegge da guasto hardware, NON da cancellazione o ransomware', example: 'Ransomware cifra dati → RAID cifra uguale', note: 'RAID + Backup = protezione reale' },
        ]
      },
      {
        title: 'NAS — Synology/QNAP',
        rows: [
          { concept: 'Share SMB', definition: 'Condivisione file Windows-compatibile', example: '\\\\NAS\\Documenti', note: 'Abilita SMB3 — disabilita SMB1 (vulnerabile)' },
          { concept: 'Integrazione AD', definition: 'NAS usa utenti AD per permessi', example: 'Join NAS al dominio → permessi su NTFS/ACL', note: 'Evita utenti locali NAS per aziende con AD' },
          { concept: 'Snapshot NAS', definition: 'Snapshot a livello filesystem del NAS', example: 'Ogni ora → 24h retention', note: 'Protezione ransomware — snapshot non cifrabili' },
          { concept: 'Replication', definition: 'Replica asincrona verso secondo NAS o cloud', example: 'NAS sede → NAS DR sede2 (rsync)', note: 'Parte della strategia 3-2-1' },
        ]
      }
    ]
  }
};
