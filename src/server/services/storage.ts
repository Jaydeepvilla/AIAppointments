export interface FileUploadResult {
  filePath: string;
  fileSize: number;
  fileType: string;
  url: string;
}

export interface StorageProvider {
  uploadFile(file: { name: string; size: number; type: string; buffer: Buffer }, organizationId: string): Promise<FileUploadResult>;
  deleteFile(filePath: string): Promise<void>;
}

// Configurable target: local (mock), vercel_blob, s3, r2
export type StorageTarget = "mock" | "vercel_blob" | "s3" | "r2";

export class StorageService implements StorageProvider {
  private target: StorageTarget;

  constructor(target: StorageTarget = "mock") {
    this.target = target;
  }

  async uploadFile(
    file: { name: string; size: number; type: string; buffer: Buffer },
    organizationId: string
  ): Promise<FileUploadResult> {
    const fileExtension = file.name.split(".").pop() || "txt";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    const filePath = `uploads/${organizationId}/${uniqueName}`;

    switch (this.target) {
      case "vercel_blob":
        // Placeholder for vercel blob client upload
        break;
      case "s3":
        // Placeholder for AWS S3 upload
        break;
      case "r2":
        // Placeholder for Cloudflare R2 upload
        break;
      case "mock":
      default:
        break;
    }

    return {
      filePath,
      fileSize: file.size,
      fileType: fileExtension.toLowerCase(),
      url: `https://storage.nexx.ai/${filePath}`,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
  }
}

export const storageService = new StorageService("mock");
