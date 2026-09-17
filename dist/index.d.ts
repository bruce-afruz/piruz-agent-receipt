export type Permission = "allow" | "deny" | "unspecified";
export interface RightsManifest {
    version: "0.1";
    subject: string;
    publisher: string;
    publishedAt: string;
    contentSha256: string;
    license: string;
    use: {
        retrieval: Permission;
        training: Permission;
        commercial: Permission;
        attribution: "required" | "optional" | "none";
    };
    expiresAt?: string;
}
export interface Receipt {
    version: "0.1";
    receiptId: string;
    manifestSha256: string;
    agent: string;
    purpose: "retrieval" | "training" | "evaluation";
    issuedAt: string;
}
export declare function validateManifest(m: RightsManifest): void;
export declare function sha256(value: string): Promise<string>;
export declare function signManifest(manifest: RightsManifest, privateKey: CryptoKey): Promise<string>;
export declare function verifyManifest(token: string, publicKey: CryptoKey): Promise<RightsManifest>;
export declare function createReceipt(manifest: RightsManifest, agent: string, purpose: Receipt["purpose"], receiptId: string, issuedAt?: string): Promise<Receipt>;
