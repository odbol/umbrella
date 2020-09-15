import { equiv } from "@thi.ng/equiv";
import * as assert from "assert";
import { parseString } from "../src";

const $ref = (id: string) => ({ $ref: id });

describe("refs", () => {
    it("resolve w/ prefix", () => {
        const db = parseString(
            `
@prefix thi: thi.ng/
thi:a
    partof -> thi:b
    knows -> alt.thi.ng/c

@prefix thi: alt.thi.ng/
thi:c
    diff -> thi:a
`,
            { opts: { prefixes: true, resolve: true } }
        ).nodes;
        assert.deepEqual(db["thi.ng/a"].partof, { $id: "thi.ng/b" });
        assert.equal(db["thi.ng/a"].knows.$id, "alt.thi.ng/c");
        assert.equal(db["alt.thi.ng/c"].diff.$id, "alt.thi.ng/a");
    });

    it("resolve circular", () => {
        const db = parseString(
            `
a
    knows -> b

b
    knows -> a
`,
            { opts: { resolve: true } }
        ).nodes;
        assert.equal(db.a.knows.$id, "b");
        assert.equal(db.b.knows.$id, "a");
    });

    it("ref array item (unresolved)", () => {
        assert(
            equiv(
                parseString(
                    `
a
    knows -> b
    knows -> c
    knows -> d

b
    name bb

c
    name cc

d
    name dd
`
                ).nodes,
                {
                    a: { $id: "a", knows: [$ref("b"), $ref("c"), $ref("d")] },
                    b: { $id: "b", name: "bb" },
                    c: { $id: "c", name: "cc" },
                    d: { $id: "d", name: "dd" },
                }
            )
        );
    });

    it("ref array item (resolved)", () => {
        assert(
            equiv(
                parseString(
                    `
a
    knows -> b
    knows -> c
    knows -> d

b
    name bb

c
    name cc

d
    name dd
`,
                    { opts: { resolve: true } }
                ).nodes,
                {
                    a: {
                        $id: "a",
                        knows: [
                            { $id: "b", name: "bb" },
                            { $id: "c", name: "cc" },
                            { $id: "d", name: "dd" },
                        ],
                    },
                    b: { $id: "b", name: "bb" },
                    c: { $id: "c", name: "cc" },
                    d: { $id: "d", name: "dd" },
                }
            )
        );
    });
});
