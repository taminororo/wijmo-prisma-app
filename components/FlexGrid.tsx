'use client'

import * as React from "react";
import "@mescius/wijmo.styles/wijmo.css";
import * as WjCore from "@mescius/wijmo";
import * as WjGrid from "@mescius/wijmo.react.grid";
import { FlexGridFilter } from "@mescius/wijmo.react.grid.filter";
import "@mescius/wijmo.cultures/wijmo.culture.ja";
import OrderUpdateButton from "./OrderUpdateButton";

WjCore.setLicenseKey('ここにWijmoのライセンスキーを設定します');

type OrderItem = {
    id: number;
    product: string;
    price: number;
    quantity: number;
    orderdate: Date;
};

const FlexGrid = () => {
    const url = "http://localhost:3000/api/orderdata/";
    const [order, setOrder] = React.useState<WjCore.CollectionView<OrderItem> | null>(null);

    //GET
    React.useEffect(() => {
        WjCore.httpRequest(url, {
            success: (xhr) => {
                setOrder(
                    new WjCore.CollectionView(JSON.parse(xhr.response, reviver), {
                        trackChanges: true,
                        pageSize: 15,
                    })
                );
            },
            error: (xhr) => {
                alert("データの取得に失敗しました");
            }
        });
    }, []);

    const update = async () => {
        if (!order) return;

        // PUT
        const putPromises = order.itemsEdited.map((item: unknown) =>
            new Promise<void>((resolve, reject) => {
                WjCore.httpRequest(url + (item as { id: number }).id, {
                    method: "PUT",
                    data: item,
                    success: () => resolve(),
                    error: () => reject(new Error("PUT Failed")),
                });
            })
        );

        // POST
        const postPromises = order.itemsAdded.map((item: unknown) =>
            new Promise<void>((resolve, reject) => {
                WjCore.httpRequest(url, {
                    method: "POST",
                    data: item,
                    success: () => resolve(),
                    error: () => reject(new Error("POST Failed")),
                });
            })
        );

        // DELETE
        const deletePromises = order.itemsRemoved.map((item: unknown) =>
            new Promise<void>((resolve, reject) => {
                WjCore.httpRequest(url + (item as { id: number }).id, {
                    method: "DELETE",
                    success: () => resolve(),
                    error: () => reject(new Error("DELETE Failed")),
                });
            })
        );

        try {
            await Promise.all([...putPromises, ...postPromises, ...deletePromises]);
            if (order.itemsEdited.length > 0)
                alert(order.itemsEdited.length + "件のデータを更新しました。");
            if (order.itemsAdded.length > 0)
                alert(order.itemsAdded.length + "件のデータを登録しました。");
            if (order.itemsRemoved.length > 0)
                alert(order.itemsRemoved.length + "件のデータを削除しました。");
            // データ再取得
            WjCore.httpRequest(url, {
                success: (xhr) => {
                    setOrder(
                        new WjCore.CollectionView(JSON.parse(xhr.response, reviver), {
                            trackChanges: true,
                            pageSize: 15,
                        })
                    );
                },
                error: () => {
                    alert("データの再取得に失敗しました");
                }
            });
        } catch (e) {
            alert("一部のリクエストでエラーが発生しました。");
        }
    };

    return (
        <div>
            <div>
                <OrderUpdateButton onClick={update} disabled={!order} />
            </div>
            <div>
                {order ? (
                    <WjGrid.FlexGrid itemsSource={order} allowAddNew={true} allowDelete={true} style={{ width: '680px' }}>
                        <FlexGridFilter />
                        <WjGrid.FlexGridColumn header="ID" binding="id" width={80} />
                        <WjGrid.FlexGridColumn header="製品名" binding="product" width={200} />
                        <WjGrid.FlexGridColumn header="単価" binding="price" width={100} />
                        <WjGrid.FlexGridColumn header="数量" binding="quantity" width={100} />
                        <WjGrid.FlexGridColumn header="受注日" binding="orderdate" width={150} />
                    </WjGrid.FlexGrid>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
}

// 日付文字列をDate型に変換するreviver関数
function reviver(key: string, val: unknown) {
    if (
        typeof val === "string" &&
        /^\d{4}-\d{2}-\d{2}T.*/.test(val)
    ) {
        return new Date(Date.parse(val));
    }
    return val;
}

export default FlexGrid;