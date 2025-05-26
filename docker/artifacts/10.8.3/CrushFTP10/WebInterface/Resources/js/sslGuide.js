$(document).ready(function() {
    flowSVG.draw(SVG('guide').size(1400, 1400));
    flowSVG.config({
        w: 220,
        h: 190,
        interactive: true,
        showButtons: true,
        connectorLength: 70,
        scrollto: true,
        scrollOffset: 300,
        arrowColour: '#4f616f',
        decisionFill: '#f5b544',
        decisionTextColour: '#000',
        processFill: '#a8db77',
        processStrokeColour: '#215a13',
        processTextColour: '#215a13',
        processLinkColour: '#215a13',
        defaultFontSize: 15,
        showButtons: false,
        labelWidth: 40,
        labelFontSize: 13
    });
    flowSVG.shapes(
    [
        {
            label: 'haveCerti',
            type: 'decision',
            text: [
                'Do you have an ',
                'existing certificate?',
            ],
            yes: 'hasCerti',
            no: 'dontHaveCerti',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'dontHaveCerti',
            type: 'process',
            links: [
                {
                    text: "Goto Wiki",
                    url: 'http://www.crushftp.com/crush9wiki/Wiki.jsp?page=SSL',
                    target: "_blank"
                }
            ],
            text: [
                'Do steps 1,2 and 3 in',
                'the CrushFTP SSL',
                'wizard.'
            ],
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'hasCerti',
            type: 'decision',
            text: [
                'Is this a renewal of',
                'an existing',
                'certificate?'
            ],
            yes: 'renewal',
            no: 'norenewal',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'norenewal',
            type: 'decision',
            text: [
                'Is it a wild card',
                'certificate?'
            ],
            yes: 'iis',
            no: 'wildcard',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'iis',
            type: 'decision',
            text: [
                'Is it in',
                'IIS already?'
            ],
            yes: 'iniis',
            no: 'apache',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'renewal',
            type: 'decision',
            text: [
                'Is the existing',
                'certificate already',
                'in CrushFTP?'
            ],
            yes: 'alreadyadded',
            no: 'iis',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'alreadyadded',
            type: 'process',
            links: [
                {
                    text: "Goto Wiki",
                    url: 'http://www.crushftp.com/crush9wiki/Wiki.jsp?page=SSL',
                    target: "_blank"
                }
            ],
            text: [
                'Do steps 2, and 3 in the',
                'CrushFTP SSL wizard.'
            ],
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'apache',
            type: 'decision',
            text: [
                'Is it in',
                'Apache already?'
            ],
            yes: 'inapache',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'inapache',
            type: 'process',
            links: [
                {
                    text: "Goto Wiki",
                    url: 'http://www.crushftp.com/crush9wiki/Wiki.jsp?page=SSL',
                    target: "_blank"
                }
            ],
            text: [
                'Get private crt key, and',
                'intermediate certs and',
                'build keystore in',
                'CrushFTP keystore utility',
                'tab.'
            ],
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'iniis',
            type: 'process',
            links: [
                {
                    text: "Goto Wiki",
                    url: 'http://www.crushftp.com/crush9wiki/Wiki.jsp?page=IISExport',
                    target: "_blank"
                }
            ],
            text: [
                'Do IIS export to PFX.'
            ],
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'wildcard',
            type: 'decision',
            text: [
                'Is this for a shared',
                'domain name',
                'pointing at this',
                'server?'
            ],
            yes: 'iis',
            no: 'shared',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'shared',
            type: 'decision',
            text: [
                'Did you create this',
                'new certificate for',
                'the CrushFTP',
                'server?'
            ],
            yes: 'create',
            orient: {
                yes:'r',
                no: 'b'
            }
        }, {
            label: 'create',
            type: 'process',
            links: [
                {
                    text: "Goto Wiki",
                    url: 'http://www.crushftp.com/crush9wiki/Wiki.jsp?page=SSL',
                    target: "_blank"
                }
            ],
            text: [
                'Create a PFX/PKCS12',
                'keystore of the',
                'certificate chain to user it',
                'in CrushFTP'
            ],
            orient: {
                yes:'r',
                no: 'b'
            }
        }
    ]);
});