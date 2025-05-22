import os
import json
import time
from tqdm import tqdm

from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.vectorstores.utils import DistanceStrategy

def load_pdf_pages(pdf_dir: str) -> list[Document]:
    pdf_docs = []
    print("[1/5] PDF 로딩 시작...")
    for idx, fn in enumerate(os.listdir(pdf_dir), start=1):
        if fn.endswith('.pdf'):
            loader = PyPDFLoader(os.path.join(pdf_dir, fn))
            pages = loader.load()
            pdf_docs.extend(pages)
            print(f"  • [{idx}] {fn} → {len(pages)}페이지 읽음")
    print(f"[완료] 총 PDF 페이지 수: {len(pdf_docs)}\n")
    return pdf_docs

def load_csv_documents(csv_path: str, encoding='utf-8') -> list[Document]:
    print("[2/5] CSV 로딩 시작...")
    loader = CSVLoader(file_path=csv_path, encoding=encoding)
    # header 제외 총 라인 수 계산
    with open(csv_path, encoding=encoding) as f:
        total = sum(1 for _ in f) - 1

    docs = []
    for idx, doc in enumerate(tqdm(loader.lazy_load(), total=total, desc="  CSV 처리"), start=1):
        docs.append(doc)
        if idx % 1000 == 0:
            print(f"    – {idx}/{total}개 처리")
    print(f"[완료] 총 CSV 문서 수: {len(docs)}\n")
    return docs

def split_documents(docs: list[Document],
                    chunk_size=500,
                    chunk_overlap=100) -> list[Document]:
    print("[3/5] 문서 분할 시작...")
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = splitter.split_documents(docs)
    print(f"[완료] 총 분할된 청크 수: {len(chunks)}\n")
    return chunks

def save_as_json(docs: list[Document], output_path: str) -> None:
    print(f"[4/5] JSON 저장 시작: {output_path}")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(
            [{"page_content": d.page_content, "metadata": d.metadata} for d in docs],
            f, ensure_ascii=False, indent=2
        )
    print("[완료] JSON 저장 완료\n")

def build_and_save_vectorstore(docs: list[Document],
                               embeddings_model,
                               save_dir: str,
                               batch_size=500) -> None:
    os.makedirs(save_dir, exist_ok=True)
    print("[5/5] 벡터스토어 구축 시작...")
    
    vectorstore = None
    # tqdm으로 프로그레스바 추가
    for start in tqdm(range(0, len(docs), batch_size), desc="임베딩 배치 처리"):
        batch = docs[start:start + batch_size]
        end = start + len(batch)
        # (프린트문은 생략해도 되고, 필요시 남겨두세요)
        # print(f"  • 배치 {start+1}–{end} 임베딩 중...")
        if vectorstore is None:
            vectorstore = FAISS.from_documents(
                batch,
                embedding=embeddings_model,
                distance_strategy=DistanceStrategy.COSINE
            )
        else:
            vectorstore.add_documents(batch)

    print("[완료] 벡터스토어 구축 완료")
    vectorstore.save_local(save_dir)
    print(f"[저장] 벡터스토어가 '{save_dir}'에 저장되었습니다.\n")

def main():
    pdf_dir         = "/Users/idahyeon/renal-diet-guide/backend/app/data/rag_data/pdf"
    csv_path        = "/Users/idahyeon/renal-diet-guide/backend/app/data/rag_data/csv/20250408_음식DB.csv"
    docs_json_path  = "/Users/idahyeon/renal-diet-guide/backend/app/data/rag_data/docs.json"
    vector_save_dir = "/Users/idahyeon/renal-diet-guide/backend/app/data/rag_data"

    # 1) PDF
    pdf_docs = load_pdf_pages(pdf_dir)
    # 2) CSV
    csv_docs = load_csv_documents(csv_path)
    # 3) 합치기 & 분할
    all_docs = pdf_docs + csv_docs
    chunks   = split_documents(all_docs)
    # 4) JSON으로 저장
    save_as_json(chunks, docs_json_path)
    # 5) 임베딩 모델 준비
    print("임베딩 모델 로드 (jhgan/ko-sroberta-nli) …")
    embeddings_model = HuggingFaceEmbeddings(
        model_name='jhgan/ko-sroberta-nli',
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True},
    )
    print("임베딩 모델 로드 완료\n")
    # 6) 벡터스토어 구축 & 저장
    build_and_save_vectorstore(chunks, embeddings_model, vector_save_dir)

if __name__ == "__main__":
    main()
