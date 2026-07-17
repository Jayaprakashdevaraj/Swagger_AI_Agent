export type SpecSourceType = 'url' | 'file' | 'git';
export interface UrlSpecSourceDto {
    type: 'url';
    url: string;
}
export interface FileSpecSourceDto {
    type: 'file';
    path: string;
}
export interface GitSpecSourceDto {
    type: 'git';
    repo: string;
    ref: string;
    filePath: string;
}
export interface ContentSpecSourceDto {
    type: 'content';
    content: string;
    fileName?: string;
}
export type SpecSourceDto = UrlSpecSourceDto | FileSpecSourceDto | GitSpecSourceDto | ContentSpecSourceDto;
export interface ImportSpecRequestDto {
    source: SpecSourceDto;
}
export interface ImportSpecResponseDto {
    specId: string;
    title: string;
    version: string;
    operationCount: number;
}
export interface SpecSummaryDto {
    id: string;
    title: string;
    version: string;
    specVersion: string;
    operationCount: number;
    tagNames: string[];
    ingestedAt: string;
    sourceRef: string;
}
export interface ValidateSpecRequestDto {
    specId?: string;
    rawContent?: string;
}
export interface ValidateSpecIssueDto {
    code: string;
    message: string;
}
export interface ValidateSpecResponseDto {
    valid: boolean;
    issues: ValidateSpecIssueDto[];
}
export interface OperationSummaryDto {
    operationId: string;
    method: string;
    path: string;
    tags: string[];
    summary?: string;
}
export interface TagSummaryDto {
    tag: string;
    operationCount: number;
}
//# sourceMappingURL=spec.dto.d.ts.map