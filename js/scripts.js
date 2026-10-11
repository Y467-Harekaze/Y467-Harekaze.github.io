/**
 * Harekaze - WebMCP Tool Registration
 * Exposes site tools to AI agents via the Model Context Protocol
 * Docs: https://webmachinelearning.github.io/webmcp/
 */
(function () {
    'use strict';

    /**
     * Register all available tools with the WebMCP runtime.
     */
    async function registerWebMCPTools() {
        if (typeof document.modelContext === 'undefined') {
            console.warn('[WebMCP] document.modelContext not available — skipping tool registration.');
            return;
        }

        const tools = [
            {
                name: 'aes-crypto',
                description: 'AES encryption and decryption tool supporting ECB, CBC, CFB modes with customizable key size (128/256 bits) and text encoding (UTF-8/Hex). Users can encrypt plaintext or decrypt ciphertext.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        mode: {
                            type: 'string',
                            enum: ['encrypt', 'decrypt'],
                            description: 'Operation mode: encrypt or decrypt'
                        },
                        inputText: {
                            type: 'string',
                            description: 'Text to encrypt or decrypt'
                        },
                        key: {
                            type: 'string',
                            description: 'AES key (for encryption; derived from ciphertext for decryption)'
                        },
                        keySize: {
                            type: 'integer',
                            enum: [128, 256],
                            description: 'AES key size in bits'
                        },
                        encoding: {
                            type: 'string',
                            enum: ['utf8', 'hex'],
                            description: 'Text encoding type'
                        }
                    },
                    required: ['mode', 'inputText']
                },
                url: 'https://harekaze.link/tools/aes-crypto.html'
            },
            {
                name: 'anti-phone-scam',
                description: 'Anti-phone-scam guide providing information and resources to help users identify and protect against phone-based scams, particularly targeting Hong Kong residents.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        scamType: {
                            type: 'string',
                            description: 'Type of phone scam to learn about (e.g., impersonation, lottery scam, government scam)'
                        },
                        language: {
                            type: 'string',
                            enum: ['zh-hk', 'en'],
                            description: 'Language preference'
                        }
                    },
                    required: ['scamType']
                },
                url: 'https://harekaze.link/tools/anti-phone-scam.html'
            },
            {
                name: 'blockchain-brute-force',
                description: 'Calculates the probability and feasibility of brute-forcing blockchain private keys. Helps users understand the security of their cryptographic keys by analyzing key space size, computational limits, and success rates.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        keyType: {
                            type: 'string',
                            enum: ['ECDSA-Secp256k1', 'Ed25519', 'RSA-2048', 'RSA-4096'],
                            description: 'Type of cryptographic key'
                        },
                        keySizeBits: {
                            type: 'integer',
                            description: 'Key size in bits'
                        },
                        computePower: {
                            type: 'string',
                            enum: ['consumer-gpu', 'enterprise-gpu', 'asic-miner', 'global-hashrate'],
                            description: 'Available computational power'
                        }
                    },
                    required: ['keySizeBits']
                },
                url: 'https://harekaze.link/tools/blockchain-private-key-brute-force-success-rate.html'
            },
            {
                name: 'bmi-calculator',
                description: 'Calculates Body Mass Index (BMI) based on height and weight. Provides BMI category and health recommendations. Supports metric (cm/kg) and imperial (ft/in, lbs) units.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        height: {
                            type: 'number',
                            description: 'Height value'
                        },
                        heightUnit: {
                            type: 'string',
                            enum: ['cm', 'ft', 'in'],
                            description: 'Height unit'
                        },
                        weight: {
                            type: 'number',
                            description: 'Weight value'
                        },
                        weightUnit: {
                            type: 'string',
                            enum: ['kg', 'lb'],
                            description: 'Weight unit'
                        }
                    },
                    required: ['height', 'weight', 'heightUnit', 'weightUnit']
                },
                url: 'https://harekaze.link/tools/bmi-calculator.html'
            },
            {
                name: 'hkcas',
                description: 'Hong Kong Anti-Scam (HKCAS) resource providing anti-fraud information, reporting tools, and educational materials for Hong Kong residents to protect against various fraud schemes.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        action: {
                            type: 'string',
                            enum: ['learn', 'report', 'resources'],
                            description: 'Action type: learn about scams, report a scam, or access resources'
                        },
                        topic: {
                            type: 'string',
                            description: 'Specific fraud topic or category'
                        }
                    },
                    required: ['action']
                },
                url: 'https://harekaze.link/tools/hkcas.html'
            },
            {
                name: 'mass-unit-conversion',
                description: 'Converts mass/weight values between multiple measurement units including grams, kilograms, pounds, ounces, stones, and tons. Supports both metric and imperial systems.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        value: {
                            type: 'number',
                            description: 'Value to convert'
                        },
                        fromUnit: {
                            type: 'string',
                            enum: ['mg', 'g', 'kg', 'oz', 'lb', 'st', 't'],
                            description: 'Source unit'
                        },
                        toUnit: {
                            type: 'string',
                            enum: ['mg', 'g', 'kg', 'oz', 'lb', 'st', 't'],
                            description: 'Target unit'
                        }
                    },
                    required: ['value', 'fromUnit', 'toUnit']
                },
                url: 'https://harekaze.link/tools/mass-unit-conversion.html'
            },
            {
                name: 'random-mark-six',
                description: 'Generates random Mark Six lottery numbers (6 numbers from 1 to 49) for Hong Kong Mark Six lottery. Can generate multiple sets with options for quick pick or manual selection.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sets: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 10,
                            description: 'Number of number sets to generate (default: 1)'
                        },
                        includeSpecial: {
                            type: 'boolean',
                            description: 'Whether to include a special number (7th number from remaining pool)'
                        }
                    },
                    required: []
                },
                url: 'https://harekaze.link/tools/random-mark-six.html'
            }
        ];

        const registeredTools = [];

        for (const tool of tools) {
            try {
                // Create a handler that opens the tool page in a new window
                const execute = async (params, signal) => {
                    if (signal?.aborted) return { success: false, error: 'Cancelled' };

                    // Build URL with query parameters if applicable
                    let url = tool.url;
                    const params = Object.keys(params).filter(k => params[k] != null);
                    if (params.length > 0) {
                        const query = params.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
                        url += `?${query}`;
                    }

                    return {
                        success: true,
                        output: {
                            type: 'url',
                            url: url,
                            title: tool.name,
                            description: tool.description
                        }
                    };
                };

                await document.modelContext.registerTool({
                    name: tool.name,
                    description: tool.description,
                    inputSchema: tool.inputSchema,
                    execute: execute
                });

                registeredTools.push(tool.name);
                console.log(`[WebMCP] Registered tool: ${tool.name}`);
            } catch (error) {
                console.warn(`[WebMCP] Failed to register tool ${tool.name}:`, error.message);
            }
        }

        if (registeredTools.length > 0) {
            console.info(`[WebMCP] Successfully registered ${registeredTools.length} tools: ${registeredTools.join(', ')}`);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerWebMCPTools);
    } else {
        registerWebMCPTools();
    }
})();
