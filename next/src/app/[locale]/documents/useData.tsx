import { useEffect, useState } from "react"
import eventEmitter from "../../../shared/utilities/emitters/EventEmitter"
import { IDocument } from "../../../shared/utilities/dataProcessor/data.types";
import { SearchSortQuery } from "../../../shared/utilities/sort/sort.types";

export const useData = () => {
    const [document, setDocument] = useState<IDocument | null>(null);
    const [postDocument, setPostDocument] = useState<IDocument | null>(null);
    const [documentsAmount, setDocumentsAmount] = useState<number>(0);
    const [documentId, setDocumentId] = useState<number | null>(null);
    const [data, setData] = useState<IDocument[] | null>(null);
    const [searchQuery, setSearchQuery] = useState<SearchSortQuery>({ tableHeader: 'id', isAscending: true, offset: 0, searchText:''});

    async function fetchData() {
        const searchParams = new URLSearchParams(searchQuery as any);
        const url = searchParams ? `/api/db/GET?${searchParams}` : '/api/db/GET';
        const response = await fetch(url);
        const documents = await response.json();
        const { data, documentsAmount } = documents;

        setData(data as IDocument[]);
        setDocumentsAmount(documentsAmount);
        eventEmitter.emit('activateSearchFilterOptions', (data.length > 0));

    }

    const handleDocumentUpdate = (newDocument: IDocument) => {
        if (newDocument === document) return;
        setDocument(newDocument);
    };

    const handleDocumentDelete = (documentId: number) => {
        setDocumentId(documentId);
    };

    const handlePostDocument = (newDocument: IDocument) => {
        setPostDocument(newDocument);
    };

    useEffect(() => {

        eventEmitter.on('updateSearchQuery', (searchQuery: SearchSortQuery) => setSearchQuery((prev) => { return { ...prev, ...searchQuery } }))
        eventEmitter.on('sendSearchValue', (searchText: string) => setSearchQuery((prev) => { return { ...prev, searchText} }))
        eventEmitter.on('deleteDocumentOnServer', handleDocumentDelete);
        eventEmitter.on('updateDocumentOnServer', handleDocumentUpdate);
        eventEmitter.on('addDocumentOnServer', handlePostDocument);
       
        return () => {
            eventEmitter.unsubscribe("updateSearchQuery");
            eventEmitter.unsubscribe('deleteDocumentOnServer');
            eventEmitter.unsubscribe('sendSearchValue');
            eventEmitter.unsubscribe('updateDocumentOnServer');
            eventEmitter.unsubscribe('addDocumentOnServer');
        };
    }, []);

    useEffect(() => {
        if (!document) return;

        (async function () {
            try {
                const response = await fetch('/api/db/PUT/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ document }),
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                const data = await response.json();
                const responseDocument = data.data;

                setData((prev) =>
                    prev.map((item) =>
                        item.id === responseDocument.id
                            ? { ...item, state: responseDocument.state, documentTotalAmount: responseDocument.documentTotalAmount, stateTime: responseDocument.stateTime.toString()}
                            : item
                    ));
            } catch (error) {
                console.error("Error updating document:", error);
            }
        })();
    }, [document]);

    useEffect(() => {
        if (!postDocument) return;
    
        (async function () {
            try {
                const response = await fetch('/api/db/POST/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postDocument }),
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                await fetchData();

            } catch (error) {
                console.error("Error updating document:", error);
            }
        })();
    }, [postDocument]);


    useEffect(() => {
        fetchData()
    }, [searchQuery]);


    useEffect(() => {
        if (!documentId) return;

        (async function () {
            try {
                const searchParams = new URLSearchParams();
                searchParams.append('id', documentId as any);

                const url = `/api/db/DELETE?${searchParams.toString()}`;
                const response = await fetch(url, { method: 'DELETE' });

                console.log('Request URL:', url);
                console.log('Request Method:', 'DELETE');

                if (response.ok) {
                    const result = await response.json();
                    console.log('Successfully deleted document:', result);

                    setData((prev) =>
                        prev.filter((item) => item.id !== documentId)
                    );
                } else {
                    console.error('Failed to delete document:', response.statusText);
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        })();
    }, [documentId]);


    return { data, document, documentsAmount, query: searchQuery };
};