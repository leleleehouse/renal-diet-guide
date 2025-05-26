from langchain_openai.chat_models import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
import json
from dotenv import load_dotenv


# Load environment variables from .env
load_dotenv()

# Load embeddings
embedding = HuggingFaceEmbeddings(
    model_name='jhgan/ko-sroberta-nli',
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': True},
)

# Load FAISS vectorstore
vectorstore = FAISS.load_local(
    "/Users/idahyeon/renal-diet-guide/backend/app/data/rag_data",
    embeddings=embedding,
    allow_dangerous_deserialization=True
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# Prompt must match RetrievalQA expected variables: context + question
prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
너는 신장투석 환자의 식이요법 전문가야.  
의료진과 환자들에게 도움이 될 수 있도록, 제공된 정보를 바탕으로 신장투석 환자의 식사 관리에 대해 정확하고 실용적인 조언을 제공해줘.  

※ 반드시 아래 사항을 반영해 작성할 것:
- 답변은 의료적 근거를 바탕으로 하되, 이해하기 쉬운 표현으로 설명할 것  
- 투석 환자에게 중요한 영양소(단백질, 칼륨, 인, 나트륨, 수분 등)에 대한 고려사항을 반영할 것  
- 실제 식단이나 식재료 예시를 포함해 구체적인 조언을 제공할 것  
- 필요 시 주의사항이나 금기사항도 함께 안내할 것  


Context: {context}  
Question: {question}  

Answer in Korean:
"""
)

llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.3, max_tokens=1025)


# Use custom prompt with RetrievalQA
qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt}
)

# # Query must be passed as plain string to match expected 'question' input
# query = "사과 먹어도 돼?"
# result = qa.invoke({"query": query})

# # 💬 출력 (길이 잘림 방지)
# print("💬 Answer:")
# print(json.dumps(result, ensure_ascii=False, indent=2))
